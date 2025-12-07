    const CACHE_NAME = 'world-of-games-cache-v1';

    const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/JS/javascript.js',

    // Images
    '/images/dragonball_z_kakarot_daima_edition_ns_switch.jpg',
    '/images/fantasy_life_i_the_girl_who_steals_time_ntscj_ns_switch.jpg',
    '/images/lego_marvel_super_heroes_2_ns_switch.jpg',
    '/images/mario_kart_8_deluxe_ns_switch.jpg',
    '/images/metroid_prime_4_beyond_ns_switch.jpg',
    '/images/pokemon_legends_za_ns_switch.jpg',
    '/images/the_legend_of_zelda_skyward_sword_hd_ns_switch.jpg',
    '/images/xenoblade_chronicles_x_definitive_edition_ns_switch.jpg',

    '/images/hades_ntscu_ns_switch%20(1).jpg',
    ];

    self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
        console.log('Caching assets...');
        return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
        Promise.all(
            keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
        )
    );
    self.clients.claim();
    });

    self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(cached => {
        return cached || fetch(event.request);
        })
    );
    });


    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.cached) {
        // Show notification
        const notification = document.getElementById('cache-notification');
        notification.style.display = 'block';

        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
        }
    });
    }