-- Seed des pays africains et de la diaspora
INSERT INTO countries (id, name, code, flag_emoji, continent_region, is_african, created_at, updated_at) VALUES
-- Afrique de l'Ouest
(UUID(), 'Nigeria', 'NGA', '🇳🇬', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Ghana', 'GHA', '🇬🇭', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Sénégal', 'SEN', '🇸🇳', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Côte d''Ivoire', 'CIV', '🇨🇮', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Mali', 'MLI', '🇲🇱', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Burkina Faso', 'BFA', '🇧🇫', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Niger', 'NER', '🇳🇪', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Guinée', 'GIN', '🇬🇳', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Bénin', 'BEN', '🇧🇯', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Togo', 'TGO', '🇹🇬', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Sierra Leone', 'SLE', '🇸🇱', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Liberia', 'LBR', '🇱🇷', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Gambie', 'GMB', '🇬🇲', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Guinée-Bissau', 'GNB', '🇬🇼', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Cap-Vert', 'CPV', '🇨🇻', 'west_africa', true, NOW(), NOW()),
(UUID(), 'Mauritanie', 'MRT', '🇲🇷', 'west_africa', true, NOW(), NOW()),

-- Afrique de l'Est
(UUID(), 'Kenya', 'KEN', '🇰🇪', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Éthiopie', 'ETH', '🇪🇹', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Tanzanie', 'TZA', '🇹🇿', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Ouganda', 'UGA', '🇺🇬', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Rwanda', 'RWA', '🇷🇼', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Burundi', 'BDI', '🇧🇮', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Somalie', 'SOM', '🇸🇴', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Érythrée', 'ERI', '🇪🇷', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Djibouti', 'DJI', '🇩🇯', 'east_africa', true, NOW(), NOW()),
(UUID(), 'Soudan du Sud', 'SSD', '🇸🇸', 'east_africa', true, NOW(), NOW()),

-- Afrique Centrale
(UUID(), 'République Démocratique du Congo', 'COD', '🇨🇩', 'central_africa', true, NOW(), NOW()),
(UUID(), 'Cameroun', 'CMR', '🇨🇲', 'central_africa', true, NOW(), NOW()),
(UUID(), 'Congo', 'COG', '🇨🇬', 'central_africa', true, NOW(), NOW()),
(UUID(), 'Gabon', 'GAB', '🇬🇦', 'central_africa', true, NOW(), NOW()),
(UUID(), 'Guinée Équatoriale', 'GNQ', '🇬🇶', 'central_africa', true, NOW(), NOW()),
(UUID(), 'République Centrafricaine', 'CAF', '🇨🇫', 'central_africa', true, NOW(), NOW()),
(UUID(), 'Tchad', 'TCD', '🇹🇩', 'central_africa', true, NOW(), NOW()),
(UUID(), 'São Tomé-et-Príncipe', 'STP', '🇸🇹', 'central_africa', true, NOW(), NOW()),

-- Afrique du Nord
(UUID(), 'Maroc', 'MAR', '🇲🇦', 'north_africa', true, NOW(), NOW()),
(UUID(), 'Algérie', 'DZA', '🇩🇿', 'north_africa', true, NOW(), NOW()),
(UUID(), 'Tunisie', 'TUN', '🇹🇳', 'north_africa', true, NOW(), NOW()),
(UUID(), 'Égypte', 'EGY', '🇪🇬', 'north_africa', true, NOW(), NOW()),
(UUID(), 'Libye', 'LBY', '🇱🇾', 'north_africa', true, NOW(), NOW()),
(UUID(), 'Soudan', 'SDN', '🇸🇩', 'north_africa', true, NOW(), NOW()),

-- Afrique Australe
(UUID(), 'Afrique du Sud', 'ZAF', '🇿🇦', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Zimbabwe', 'ZWE', '🇿🇼', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Zambie', 'ZMB', '🇿🇲', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Mozambique', 'MOZ', '🇲🇿', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Angola', 'AGO', '🇦🇴', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Namibie', 'NAM', '🇳🇦', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Botswana', 'BWA', '🇧🇼', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Malawi', 'MWI', '🇲🇼', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Lesotho', 'LSO', '🇱🇸', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Eswatini', 'SWZ', '🇸🇿', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Madagascar', 'MDG', '🇲🇬', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Maurice', 'MUS', '🇲🇺', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Comores', 'COM', '🇰🇲', 'south_africa', true, NOW(), NOW()),
(UUID(), 'Seychelles', 'SYC', '🇸🇨', 'south_africa', true, NOW(), NOW()),

-- Diaspora
(UUID(), 'France', 'FRA', '🇫🇷', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Royaume-Uni', 'GBR', '🇬🇧', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Belgique', 'BEL', '🇧🇪', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Allemagne', 'DEU', '🇩🇪', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Italie', 'ITA', '🇮🇹', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Espagne', 'ESP', '🇪🇸', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Portugal', 'PRT', '🇵🇹', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Pays-Bas', 'NLD', '🇳🇱', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'Suisse', 'CHE', '🇨🇭', 'diaspora_europe', false, NOW(), NOW()),
(UUID(), 'États-Unis', 'USA', '🇺🇸', 'diaspora_americas', false, NOW(), NOW()),
(UUID(), 'Canada', 'CAN', '🇨🇦', 'diaspora_americas', false, NOW(), NOW()),
(UUID(), 'Brésil', 'BRA', '🇧🇷', 'diaspora_americas', false, NOW(), NOW()),
(UUID(), 'Haïti', 'HTI', '🇭🇹', 'diaspora_americas', false, NOW(), NOW()),
(UUID(), 'Jamaïque', 'JAM', '🇯🇲', 'diaspora_americas', false, NOW(), NOW());

-- Seed des langues
INSERT INTO languages (id, name, name_local, code, is_african, created_at, updated_at) VALUES
-- Langues africaines
(UUID(), 'Swahili', 'Kiswahili', 'sw', true, NOW(), NOW()),
(UUID(), 'Hausa', 'Hausa', 'ha', true, NOW(), NOW()),
(UUID(), 'Yoruba', 'Yorùbá', 'yo', true, NOW(), NOW()),
(UUID(), 'Igbo', 'Igbo', 'ig', true, NOW(), NOW()),
(UUID(), 'Amharique', 'አማርኛ', 'am', true, NOW(), NOW()),
(UUID(), 'Zoulou', 'isiZulu', 'zu', true, NOW(), NOW()),
(UUID(), 'Wolof', 'Wolof', 'wo', true, NOW(), NOW()),
(UUID(), 'Lingala', 'Lingála', 'ln', true, NOW(), NOW()),
(UUID(), 'Bambara', 'Bamanankan', 'bm', true, NOW(), NOW()),
(UUID(), 'Peul/Fulani', 'Fulfulde', 'ff', true, NOW(), NOW()),
(UUID(), 'Kikongo', 'Kikongo', 'kg', true, NOW(), NOW()),
(UUID(), 'Twi', 'Twi', 'tw', true, NOW(), NOW()),
(UUID(), 'Shona', 'chiShona', 'sn', true, NOW(), NOW()),
(UUID(), 'Somali', 'Soomaali', 'so', true, NOW(), NOW()),
(UUID(), 'Tigrinya', 'ትግርኛ', 'ti', true, NOW(), NOW()),
(UUID(), 'Oromo', 'Afaan Oromoo', 'om', true, NOW(), NOW()),
(UUID(), 'Kinyarwanda', 'Ikinyarwanda', 'rw', true, NOW(), NOW()),
(UUID(), 'Kirundi', 'Ikirundi', 'rn', true, NOW(), NOW()),
(UUID(), 'Malagasy', 'Malagasy', 'mg', true, NOW(), NOW()),
(UUID(), 'Xhosa', 'isiXhosa', 'xh', true, NOW(), NOW()),

-- Langues internationales
(UUID(), 'Français', 'Français', 'fr', false, NOW(), NOW()),
(UUID(), 'Anglais', 'English', 'en', false, NOW(), NOW()),
(UUID(), 'Portugais', 'Português', 'pt', false, NOW(), NOW()),
(UUID(), 'Arabe', 'العربية', 'ar', false, NOW(), NOW()),
(UUID(), 'Espagnol', 'Español', 'es', false, NOW(), NOW()),
(UUID(), 'Créole haïtien', 'Kreyòl ayisyen', 'ht', false, NOW(), NOW());

-- Seed des plans d'abonnement
INSERT INTO plans (id, name, slug, description, price_monthly, price_yearly, currency, daily_likes_limit, daily_super_likes, can_see_who_liked, can_rewind, can_use_incognito, can_use_passport, can_use_advanced_filters, can_see_read_status, monthly_boosts, priority_messages, is_active, created_at, updated_at) VALUES
(UUID(), 'Gratuit', 'free', 'Accès aux fonctionnalités de base', 0.00, 0.00, 'EUR', 50, 1, false, false, false, false, false, false, 0, false, true, NOW(), NOW()),
(UUID(), 'Premium', 'premium', 'Toutes les fonctionnalités Premium pour maximiser vos chances', 14.99, 119.99, 'EUR', NULL, 5, true, true, true, true, true, true, 1, true, true, NOW(), NOW());
