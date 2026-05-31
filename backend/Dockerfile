FROM php:8.2-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libgd-dev \
    libzip-dev \
    zip \
    unzip \
    ffmpeg \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    gd \
    zip \
    fileinfo \
    exif

# Habilitar mod_rewrite e headers
RUN a2enmod rewrite headers

# Configurar Apache para servir a pasta public/
RUN sed -i 's|/var/www/html|/var/www/html/public|g' \
    /etc/apache2/sites-available/000-default.conf

# Permitir .htaccess na pasta public
RUN printf '<Directory /var/www/html/public>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n' >> /etc/apache2/sites-available/000-default.conf

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Ignorar bloqueio de advisories de seguranca para evitar quebras no build local
ENV COMPOSER_POLICY_ADVISORIES_BLOCK=0

# Copiar e instalar dependências PHP (aproveitar cache)
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts 2>/dev/null || \
    composer install --no-dev --no-scripts

# Copiar restante do código
COPY . .

# Criar diretórios de storage e configurar permissões
RUN mkdir -p /var/www/storage/{music,movies,thumbnails,temp} \
    && chown -R www-data:www-data /var/www/storage \
    && chmod -R 755 /var/www/storage

EXPOSE 80
