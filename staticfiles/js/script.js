(function () {
    "use strict";


    /* ==========================================================
       REDUCED MOTION
       ========================================================== */

    var reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;



    /* ==========================================================
       NAV SCROLL STATE
       ========================================================== */

    var navEl =
        document.getElementById('nav');

    var scrollCueEl =
        document.getElementById('scrollCue');

    var heroInnerEl =
        document.querySelector('.hero-inner');


    function onScrollUI() {

        var y =
            window.scrollY ||
            window.pageYOffset;


        if (y > 10) {

            navEl.classList.add('scrolled');

        } else {

            navEl.classList.remove('scrolled');

        }

    }


    window.addEventListener(
        'scroll',
        onScrollUI,
        {
            passive: true
        }
    );


    onScrollUI();


    /* ==========================================================
       MOBILE NAVIGATION
       ========================================================== */

    var mobileMenuToggle =
        document.querySelector('.mobile-menu-toggle');

    var mobileMenu =
        document.getElementById('mobileMenu');


    function closeMobileMenu() {

        if (
            !mobileMenuToggle ||
            !mobileMenu
        ) {
            return;
        }

        mobileMenuToggle.classList.remove(
            'active'
        );

        mobileMenuToggle.setAttribute(
            'aria-expanded',
            'false'
        );

        mobileMenu.classList.remove(
            'open'
        );

        mobileMenu.setAttribute(
            'aria-hidden',
            'true'
        );

    }


    function toggleMobileMenu() {

        if (
            !mobileMenuToggle ||
            !mobileMenu
        ) {
            return;
        }

        var isOpen =
            mobileMenu.classList.toggle(
                'open'
            );

        mobileMenuToggle.classList.toggle(
            'active',
            isOpen
        );

        mobileMenuToggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );

        mobileMenu.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );

    }


    if (
        mobileMenuToggle &&
        mobileMenu
    ) {

        mobileMenuToggle.addEventListener(
            'click',
            toggleMobileMenu
        );


        mobileMenu
            .querySelectorAll('a')
            .forEach(function (link) {

                link.addEventListener(
                    'click',
                    closeMobileMenu
                );

            });


        document.addEventListener(
            'click',
            function (event) {

                if (
                    !mobileMenu.classList.contains('open') ||
                    mobileMenu.contains(event.target) ||
                    mobileMenuToggle.contains(event.target)
                ) {
                    return;
                }

                closeMobileMenu();

            }
        );


        window.addEventListener(
            'resize',
            function () {

                if (
                    window.innerWidth > 780
                ) {
                    closeMobileMenu();
                }

            }
        );

    }



    /* ==========================================================
       THREE.JS BINARY SPHERE
       ========================================================== */

    var canvas =
        document.getElementById('bg-canvas');


    var renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );



    /* ==========================================================
       SCENE
       ========================================================== */

    var scene =
        new THREE.Scene();


    var camera =
        new THREE.PerspectiveCamera(
            48,
            window.innerWidth /
                window.innerHeight,
            0.1,
            200
        );


    camera.position.set(
        0,
        0,
        32
    );



    /* ==========================================================
       GLYPH TEXTURE
       ========================================================== */

    function makeGlyphTexture() {

        var c =
            document.createElement('canvas');


        c.width = 320;
        c.height = 160;


        var ctx =
            c.getContext('2d');


        ctx.clearRect(
            0,
            0,
            c.width,
            c.height
        );


        ctx.textAlign =
            'center';

        ctx.textBaseline =
            'middle';


        ctx.font =
            '800 122px "JetBrains Mono", monospace';


        ctx.shadowColor =
            'rgba(220,245,255,0.95)';


        ctx.shadowBlur = 10;


        ctx.fillStyle =
            '#ffffff';


        ctx.fillText(
            '0',
            80,
            86
        );


        ctx.fillText(
            '1',
            240,
            86
        );


        var tex =
            new THREE.CanvasTexture(c);


        tex.minFilter =
            THREE.LinearFilter;

        tex.magFilter =
            THREE.LinearFilter;


        return tex;

    }


    var glyphTex =
        makeGlyphTexture();



    /* ==========================================================
       PARTICLE SETTINGS
       ========================================================== */

    var COUNT = 2400;

    var SPHERE_R = 9.5;


    var aBase =
        new Float32Array(
            COUNT * 3
        );


    var aExplode =
        new Float32Array(
            COUNT * 3
        );


    var aDigit =
        new Float32Array(
            COUNT
        );


    var aRandom =
        new Float32Array(
            COUNT
        );



    /* ==========================================================
       CREATE SPHERE POSITIONS
       ========================================================== */

    for (
        var i = 0;
        i < COUNT;
        i++
    ) {

        var phi =
            Math.acos(
                1 -
                2 *
                (
                    i + 0.5
                ) /
                COUNT
            );


        var theta =
            Math.PI *
            (
                1 +
                Math.sqrt(5)
            ) *
            i;


        var y =
            Math.cos(phi);


        var radiusAtY =
            Math.sqrt(
                Math.max(
                    0,
                    1 -
                    y * y
                )
            );


        var x =
            Math.cos(theta) *
            radiusAtY;


        var z =
            Math.sin(theta) *
            radiusAtY;


        var jitter =
            SPHERE_R +
            (
                Math.random() * 0.5 -
                0.25
            );


        /* Base sphere position */

        aBase[i * 3 + 0] =
            x * jitter;

        aBase[i * 3 + 1] =
            y * jitter;

        aBase[i * 3 + 2] =
            z * jitter;


        /* Exploded position */

        aExplode[i * 3 + 0] =
            (
                Math.random() * 2 -
                1
            ) * 22;


        aExplode[i * 3 + 1] =
            (
                Math.random() * 2 -
                1
            ) * 13;


        aExplode[i * 3 + 2] =
            (
                Math.random() * 2 -
                1
            ) * 18 - 4;


        /* Random binary digit */

        aDigit[i] =
            Math.random() > 0.5
                ? 1.0
                : 0.0;


        /* Random value */

        aRandom[i] =
            Math.random();

    }



    /* ==========================================================
       BUFFER GEOMETRY
       ========================================================== */

    var geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            aBase,
            3
        )
    );


    geometry.setAttribute(
        'aBase',
        new THREE.BufferAttribute(
            aBase,
            3
        )
    );


    geometry.setAttribute(
        'aExplode',
        new THREE.BufferAttribute(
            aExplode,
            3
        )
    );


    geometry.setAttribute(
        'aDigit',
        new THREE.BufferAttribute(
            aDigit,
            1
        )
    );


    geometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(
            aRandom,
            1
        )
    );



    /* ==========================================================
       SHADER UNIFORMS
       ========================================================== */

    var uniforms = {

        uTime: {
            value: 0
        },

        uMix: {
            value: 0
        },

        uBaseOpacity: {
            value: 0.32
        },

        uPointScale: {
            value: 520.0
        },

        uMap: {
            value: glyphTex
        },

        uColorA: {
            value:
                new THREE.Color(
                    '#CCFBF1'
                )
        },

        uColorB: {
            value:
                new THREE.Color(
                    '#0F766E'
                )
        }

    };



    /* ==========================================================
       VERTEX SHADER
       ========================================================== */

    var vertexShader = [

        'attribute vec3 aBase;',

        'attribute vec3 aExplode;',

        'attribute float aDigit;',

        'attribute float aRandom;',

        'uniform float uTime;',

        'uniform float uMix;',

        'uniform float uPointScale;',

        'varying float vDigit;',

        'varying float vRandom;',

        'varying float vShade;',

        'void main(){',

        '  vDigit = aDigit;',

        '  vRandom = aRandom;',

        '  vec3 pos = mix(aBase, aExplode, uMix);',

        '  float drift = uMix;',

        '  float phase = aRandom * 6.2831853;',

        '  pos.x += sin(uTime*0.15 + phase) * 1.4 * drift;',

        '  pos.y += cos(uTime*0.12 + phase) * 1.1 * drift;',

        '  pos.z += sin(uTime*0.10 + phase*1.3) * 1.2 * drift;',

        '  vec3 normalDir = normalize(aBase + 0.0001);',

        '  pos += normalDir * sin(uTime*0.3 + phase) * 0.06 * (1.0 - uMix);',

        '  vec3 lightDir = normalize(vec3(0.4, 0.6, 1.0));',

        '  float lightAmt = clamp(dot(normalDir, lightDir), 0.28, 1.0);',

        /*
         * IMPORTANT:
         * Previously this used uMix, which made the binary
         * characters change their brightness/color behavior
         * while scrolling.
         *
         * The movement still uses uMix exactly as before.
         * Only the scroll-dependent color/brightness interpolation
         * has been removed.
         */

        '  vShade = lightAmt;',

        '  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);',

        '  gl_PointSize = uPointScale * (0.8 + aRandom * 0.6) / max(-mvPosition.z, 1.0);',

        '  gl_Position = projectionMatrix * mvPosition;',

        '}'

    ].join('\n');



    /* ==========================================================
       FRAGMENT SHADER
       ========================================================== */

    var fragmentShader = [

        'uniform sampler2D uMap;',

        'uniform float uMix;',

        'uniform float uBaseOpacity;',

        'uniform vec3 uColorA;',

        'uniform vec3 uColorB;',

        'varying float vDigit;',

        'varying float vRandom;',

        'varying float vShade;',

        'void main(){',

        '  vec2 uv = gl_PointCoord;',

        '  uv.x = uv.x * 0.5 + (vDigit > 0.5 ? 0.5 : 0.0);',

        '  vec4 tex = texture2D(uMap, uv);',

        '  vec3 color = mix(uColorA, uColorB, vRandom) * vShade * 1.35;',

        '  float ambient = mix(1.0, uBaseOpacity, uMix);',

        '  float opacity = tex.a * ambient * (0.65 + vRandom*0.45);',

        '  if(opacity < 0.01) discard;',

        '  gl_FragColor = vec4(color, opacity);',

        '}'

    ].join('\n');



    /* ==========================================================
       SHADER MATERIAL
       ========================================================== */

    var material =
        new THREE.ShaderMaterial({

            uniforms:
                uniforms,

            vertexShader:
                vertexShader,

            fragmentShader:
                fragmentShader,

            transparent:
                true,

            depthWrite:
                false,

            depthTest:
                false,

            blending:
                THREE.AdditiveBlending

        });



    /* ==========================================================
       PARTICLE SYSTEM
       ========================================================== */

    var points =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(points);



    /* ==========================================================
       SCROLL-DRIVEN EXPLOSION
       ========================================================== */

    var targetMix = 0;

    var currentMix = 0;


    var heroHeight =
        window.innerHeight;



    function updateScrollTarget() {

        var y =
            window.scrollY ||
            window.pageYOffset;


        var progress =
            y /
            (
                heroHeight *
                0.9
            );


        targetMix =
            Math.min(
                Math.max(
                    progress,
                    0
                ),
                1
            );


        /* Hero fade */

        if (heroInnerEl) {

            var fade =
                Math.min(
                    Math.max(
                        1 -
                        progress *
                        1.6,
                        0
                    ),
                    1
                );


            heroInnerEl.style.opacity =
                fade;


            heroInnerEl.style.transform =
                'translateY(' +
                (
                    -progress *
                    40
                ) +
                'px)';

        }


        /* Scroll cue fade */

        if (scrollCueEl) {

            scrollCueEl.style.opacity =
                Math.min(
                    Math.max(
                        1 -
                        progress *
                        3,
                        0
                    ),
                    1
                );

        }

    }


    window.addEventListener(
        'scroll',
        updateScrollTarget,
        {
            passive: true
        }
    );


    updateScrollTarget();



    /* ==========================================================
       MOUSE PARALLAX
       ========================================================== */

    var mouseX = 0;

    var mouseY = 0;

    var camX = 0;

    var camY = 0;


    window.addEventListener(
        'mousemove',
        function (e) {

            mouseX =
                (
                    e.clientX /
                    window.innerWidth -
                    0.5
                ) * 2;


            mouseY =
                (
                    e.clientY /
                    window.innerHeight -
                    0.5
                ) * 2;

        },
        {
            passive: true
        }
    );



    /* ==========================================================
       RESIZE
       ========================================================== */

    function onResize() {

        var w =
            window.innerWidth;

        var h =
            window.innerHeight;


        renderer.setSize(
            w,
            h
        );


        camera.aspect =
            w / h;


        camera.updateProjectionMatrix();


        heroHeight = h;


        updateScrollTarget();

    }


    window.addEventListener(
        'resize',
        onResize
    );



    /* ==========================================================
       RENDER LOOP
       ========================================================== */

    var clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        var dt =
            clock.getDelta();


        var elapsed =
            clock.elapsedTime;


        uniforms.uTime.value =
            reducedMotion
                ? elapsed * 0.15
                : elapsed;


        /* Smooth scroll transition */

        currentMix +=
            (
                targetMix -
                currentMix
            ) * 0.06;


        uniforms.uMix.value =
            currentMix;



        /* Animation */

        if (!reducedMotion) {

            points.rotation.y +=
                dt *
                0.05 *
                (
                    1 -
                    currentMix *
                    0.85
                );


            points.rotation.x =
                Math.sin(
                    elapsed *
                    0.08
                ) *
                0.05 *
                (
                    1 -
                    currentMix
                );



            /* Camera parallax */

            camX +=
                (
                    mouseX *
                    0.7 -
                    camX
                ) * 0.03;


            camY +=
                (
                    -mouseY *
                    0.5 -
                    camY
                ) * 0.03;


            camera.position.x =
                camX;


            camera.position.y =
                camY;


            camera.lookAt(
                0,
                0,
                0
            );

        }


        renderer.render(
            scene,
            camera
        );

    }


    animate();



    /* ==========================================================
       PROJECT VIDEO MODAL / LIGHTBOX
       ========================================================== */

    var projectVideoModal =
        document.getElementById(
            'projectVideoModal'
        );


    var projectModalVideo =
        document.getElementById(
            'projectModalVideo'
        );


    var projectVideoClose =
        document.querySelector(
            '.project-video-close'
        );


    var activeProjectVideo =
        null;


    function getProjectVideoSource(card) {

        if (!card) {
            return '';
        }


        var source =
            card.getAttribute(
                'data-project-video'
            );


        if (source) {
            return source;
        }


        var video =
            card.querySelector(
                'video'
            );


        var sourceEl =
            video &&
            video.querySelector(
                'source'
            );


        return (
            (
                sourceEl &&
                sourceEl.getAttribute(
                    'src'
                )
            ) ||
            (
                video &&
                video.currentSrc
            ) ||
            ''
        );

    }


    function openProjectVideo(card) {

        if (
            !projectVideoModal ||
            !projectModalVideo ||
            !card
        ) {
            return;
        }


        var src =
            getProjectVideoSource(
                card
            );


        if (!src) {
            return;
        }


        activeProjectVideo =
            card.querySelector(
                'video'
            );


        if (activeProjectVideo) {
            activeProjectVideo.pause();
        }


        projectModalVideo.pause();


        projectModalVideo.removeAttribute(
            'src'
        );


        while (
            projectModalVideo.firstChild
        ) {
            projectModalVideo.removeChild(
                projectModalVideo.firstChild
            );
        }


        var sourceEl =
            document.createElement(
                'source'
            );


        sourceEl.src =
            src;

        sourceEl.type =
            'video/mp4';


        projectModalVideo.appendChild(
            sourceEl
        );


        projectModalVideo.load();


        /*
         * The preview remains muted.
         * The modal is opened through an intentional user
         * click, so sound is enabled here.
         */

        projectModalVideo.muted =
            false;


        projectModalVideo.volume =
            1;


        projectVideoModal.classList.add(
            'open'
        );


        projectVideoModal.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.classList.add(
            'video-modal-open'
        );


        /*
         * Because this happens directly after the user's
         * click, browsers generally permit playback with audio.
         */

        var playPromise =
            projectModalVideo.play();


        if (
            playPromise &&
            typeof playPromise.catch ===
                'function'
        ) {

            playPromise.catch(
                function () {

                    /*
                     * Native controls remain available
                     * if the browser decides not to autoplay.
                     */

                }
            );

        }

    }


    function closeProjectVideo() {

        if (!projectVideoModal) {
            return;
        }


        projectModalVideo.pause();


        projectModalVideo.removeAttribute(
            'src'
        );


        while (
            projectModalVideo.firstChild
        ) {

            projectModalVideo.removeChild(
                projectModalVideo.firstChild
            );

        }


        projectModalVideo.load();


        projectVideoModal.classList.remove(
            'open'
        );


        projectVideoModal.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.classList.remove(
            'video-modal-open'
        );


        /*
         * Restore the original card preview.
         */

        if (activeProjectVideo) {

            activeProjectVideo
                .play()
                .catch(
                    function () {}
                );

        }


        activeProjectVideo =
            null;

    }


    /*
     * One reusable event handler for every project card.
     *
     * It supports:
     * - clicking the preview video
     * - clicking VIEW PROJECT
     */

    document.addEventListener(
        'click',
        function (event) {

            var trigger =
                event.target.closest(
                    '.project-video, .project-view-trigger'
                );


            if (!trigger) {
                return;
            }


            var card =
                trigger.closest(
                    '[data-project-video]'
                );


            if (!card) {
                return;
            }


            event.preventDefault();


            openProjectVideo(
                card
            );

        }
    );


    /*
     * Close when clicking the dark backdrop.
     */

    if (projectVideoModal) {

        projectVideoModal.addEventListener(
            'click',
            function (event) {

                if (
                    event.target ===
                    projectVideoModal
                ) {

                    closeProjectVideo();

                }

            }
        );

    }


    /*
     * Close button.
     */

    if (projectVideoClose) {

        projectVideoClose.addEventListener(
            'click',
            closeProjectVideo
        );

    }


    /*
     * Escape key.
     */

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key === 'Escape' &&
                projectVideoModal &&
                projectVideoModal.classList.contains(
                    'open'
                )
            ) {

                closeProjectVideo();

            }

        }
    );



    /* ==========================================================
       GSAP SECTION REVEALS
       ========================================================== */

    if (
        window.gsap &&
        window.ScrollTrigger
    ) {

        gsap.registerPlugin(
            ScrollTrigger
        );


        /* Section Headers */

        gsap
            .utils
            .toArray(
                '.section-head'
            )
            .forEach(
                function (el) {

                    gsap.from(
                        el,
                        {

                            opacity: 0,

                            y: 24,

                            duration: 0.9,

                            ease:
                                'power2.out',

                            scrollTrigger: {

                                trigger: el,

                                start:
                                    'top 82%'

                            }

                        }
                    );

                }
            );



        /* Cards */

        gsap
            .utils
            .toArray(
                'section .grid'
            )
            .forEach(
                function (grid) {

                    var cards =
                        grid.querySelectorAll(
                            '.card'
                        );


                    gsap.from(
                        cards,
                        {

                            opacity: 0,

                            y: 30,

                            duration: 0.8,

                            stagger: 0.09,

                            ease:
                                'power2.out',

                            scrollTrigger: {

                                trigger: grid,

                                start:
                                    'top 85%'

                            }

                        }
                    );

                }
            );



        /* Section Buttons */

        gsap.from(
            '.section-footer .btn-outline',
            {

                opacity: 0,

                y: 16,

                duration: 0.7,

                ease:
                    'power2.out',

                scrollTrigger: {

                    trigger:
                        '.section-footer',

                    start:
                        'top 92%'

                }

            }
        );



        /* Footer */

        gsap
            .utils
            .toArray(
                '.footer-col, .footer-brand'
            )
            .forEach(
                function (el) {

                    gsap.from(
                        el,
                        {

                            opacity: 0,

                            y: 20,

                            duration: 0.8,

                            ease:
                                'power2.out',

                            scrollTrigger: {

                                trigger: el,

                                start:
                                    'top 95%'

                            }

                        }
                    );

                }
            );

    }

})();