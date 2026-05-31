-- ============================================================
-- SERVIDOR PESSOAL MULTIUSUÁRIO — Schema PostgreSQL 16
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- FUNÇÃO UTILITÁRIA: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- MÓDULO: USUÁRIOS E AUTENTICAÇÃO
-- ============================================================
CREATE TABLE roles (
    id          SMALLINT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'user');

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id       VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    role_id         SMALLINT NOT NULL DEFAULT 2 REFERENCES roles(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_google  ON users(google_id);

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- MÓDULO: MÚSICA
-- ============================================================
CREATE TABLE artists (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    bio         TEXT,
    image_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_artists_name ON artists USING gin(name gin_trgm_ops);

CREATE TRIGGER set_artists_updated_at
    BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE albums (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id       UUID REFERENCES artists(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    release_year    SMALLINT,
    cover_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_albums_artist ON albums(artist_id);

CREATE TRIGGER set_albums_updated_at
    BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE songs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    artist_id       UUID REFERENCES artists(id) ON DELETE SET NULL,
    album_id        UUID REFERENCES albums(id) ON DELETE SET NULL,
    title           VARCHAR(500) NOT NULL,
    duration_secs   INTEGER,
    file_path       TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type       VARCHAR(100) NOT NULL DEFAULT 'audio/mpeg',
    bitrate_kbps    INTEGER,
    genre           VARCHAR(100),
    track_number    SMALLINT,
    year            SMALLINT,
    play_count      BIGINT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_songs_artist  ON songs(artist_id);
CREATE INDEX idx_songs_title   ON songs USING gin(title gin_trgm_ops);

CREATE TRIGGER set_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE playlists (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url   TEXT,
    is_public   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_playlists_user   ON playlists(user_id);

CREATE TRIGGER set_playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE playlist_songs (
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id     UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    position    INTEGER NOT NULL DEFAULT 0,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (playlist_id, song_id)
);

CREATE TABLE song_favorites (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id     UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);

-- ============================================================
-- MÓDULO: FILMES
-- ============================================================
CREATE TABLE genres (
    id      SMALLSERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO genres (name) VALUES
    ('Ação'), ('Comédia'), ('Drama'), ('Terror'), ('Ficção Científica'),
    ('Documentário'), ('Animação'), ('Romance'), ('Thriller'), ('Aventura');

CREATE TABLE movies (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by         UUID NOT NULL REFERENCES users(id),
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    year                SMALLINT,
    duration_secs       INTEGER,
    file_path           TEXT NOT NULL,
    file_size_bytes     BIGINT,
    thumbnail_path      TEXT,
    rating              DECIMAL(3,1),
    director            VARCHAR(255),
    cast_members        TEXT[],
    language            VARCHAR(50) DEFAULT 'pt-BR',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    view_count          BIGINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_movies_title  ON movies USING gin(title gin_trgm_ops);

CREATE TRIGGER set_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE movie_genres (
    movie_id    UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id    SMALLINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE watchlist (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id    UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, movie_id)
);

CREATE TABLE watch_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id        UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    progress_secs   INTEGER NOT NULL DEFAULT 0,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    watched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, movie_id)
);

-- ============================================================
-- MÓDULO: GARAGEM
-- ============================================================
CREATE TYPE car_status AS ENUM ('active', 'sold', 'scrapped');

CREATE TABLE cars (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand               VARCHAR(100) NOT NULL,
    model               VARCHAR(200) NOT NULL,
    year_manufacture    SMALLINT NOT NULL,
    year_model          SMALLINT,
    color               VARCHAR(50),
    plate               VARCHAR(20),
    vin                 VARCHAR(50),
    purchase_price      DECIMAL(12,2) NOT NULL,
    purchase_date       DATE NOT NULL,
    purchase_km         INTEGER,
    sale_price          DECIMAL(12,2),
    sale_date           DATE,
    sale_km             INTEGER,
    status              car_status NOT NULL DEFAULT 'active',
    notes               TEXT,
    image_urls          TEXT[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cars_owner  ON cars(owner_id);

CREATE TRIGGER set_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE maintenances (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(100),
    cost            DECIMAL(10,2) NOT NULL DEFAULT 0,
    km_at_service   INTEGER,
    shop_name       VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_maintenances_car  ON maintenances(car_id, date DESC);

CREATE TRIGGER set_maintenances_updated_at
    BEFORE UPDATE ON maintenances
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE fuel_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    liters          DECIMAL(8,3) NOT NULL,
    price_per_liter DECIMAL(6,3) NOT NULL,
    total_cost      DECIMAL(10,2) GENERATED ALWAYS AS (liters * price_per_liter) STORED,
    km_at_fill      INTEGER,
    fuel_type       VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_fuel_car ON fuel_records(car_id, date DESC);

CREATE VIEW car_financial_summary AS
SELECT
    c.id AS car_id,
    c.owner_id,
    c.brand || ' ' || c.model || ' ' || c.year_model AS car_name,
    c.purchase_price,
    c.sale_price,
    c.status,
    COALESCE(SUM(DISTINCT m.cost), 0) AS total_maintenance_cost,
    COALESCE(SUM(DISTINCT f.total_cost), 0) AS total_fuel_cost,
    COALESCE(SUM(DISTINCT m.cost), 0) + COALESCE(SUM(DISTINCT f.total_cost), 0) AS total_expenses,
    CASE
        WHEN c.status = 'sold' AND c.sale_price IS NOT NULL
        THEN c.sale_price - c.purchase_price
              - COALESCE(SUM(DISTINCT m.cost), 0)
              - COALESCE(SUM(DISTINCT f.total_cost), 0)
        ELSE NULL
    END AS profit_loss
FROM cars c
LEFT JOIN maintenances m ON m.car_id = c.id
LEFT JOIN fuel_records f ON f.car_id = c.id
GROUP BY c.id;
