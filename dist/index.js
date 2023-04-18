"use strict";
/*
 * Autopause & sync playback of elaticity video
 */
((window, document) => {
    // Settings & Target Element
    const TARGET_VIDEO_ATTRIBUTE = 'data-artisan-sync-play';
    const INTERSECT_VERTICAL_MARGIN_PX = 150;
    const INTERSECT_DETECTION_MARGIN = `${INTERSECT_VERTICAL_MARGIN_PX}px ${INTERSECT_VERTICAL_MARGIN_PX}px 0px 0px`;
    const videos = document.querySelectorAll(`video[${TARGET_VIDEO_ATTRIBUTE}]`);
    // Only allow playback when all 3 videos are ready.
    let canPlay = false;
    // Playback is synced clock based to make it dead simple.
    let syncTimerStartedAt;
    // Utility function to detect if all videos are ready to play
    const getIfAllVideosReady = () => {
        let isReady = true;
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            if (video.readyState !== video.HAVE_ENOUGH_DATA)
                isReady = false;
        }
        return isReady;
    };
    // Playback control
    const play = (video) => {
        if (!canPlay)
            return;
        if (!syncTimerStartedAt)
            throw new Error('syncTimerStartedAt is undefined, something\'s wrong with the first playback process');
        const duration = video.duration;
        video.currentTime = ((Date.now() - syncTimerStartedAt) / 1000) % duration;
        return video.play();
    };
    const pauseAndReset = (video) => {
        video.pause();
        video.currentTime = 0;
    };
    // Utility to detect videos on screen upon before intersection event.
    const checkIfInViewportAndControlPlayback = (video) => {
        const videoRect = video.getBoundingClientRect();
        const triggerTop = videoRect.top - INTERSECT_VERTICAL_MARGIN_PX, triggerBottom = videoRect.bottom + INTERSECT_VERTICAL_MARGIN_PX;
        const isTopInViewport = triggerTop <= (window.innerHeight || document.documentElement.clientHeight);
        const isBottomInViewport = triggerBottom <= (window.innerHeight || document.documentElement.clientHeight);
        if (isTopInViewport || isBottomInViewport)
            return play(video);
        pauseAndReset(video);
    };
    // Attach listeners
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        // Create Intersection Observer to detect on/off screen event
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (!canPlay)
                    return;
                if (entry.isIntersecting)
                    return play(entry.target);
                pauseAndReset(entry.target);
            });
        };
        const observerOpts = {
            root: null,
            rootMargin: INTERSECT_DETECTION_MARGIN,
            threshold: 0
        };
        const observer = new IntersectionObserver(callback, observerOpts);
        observer.observe(video);
        // Listen to video ready state to sync playback
        video.addEventListener('canplaythrough', (e) => {
            if (!canPlay && getIfAllVideosReady()) {
                // this is the first playback.
                canPlay = true;
                // Set sync clock start time
                syncTimerStartedAt = Date.now();
                // manually checking if videos are in viewport as Intersection Observer will not fire until first intersection event (fired by scroll)
                videos.forEach(video => checkIfInViewportAndControlPlayback(video));
            }
        }, { once: true });
    }
})(window, document);
/*
 * Autopause offscreen for aiming style vieos
 */
((window, document) => {
    // Settings & Target Element
    const TARGET_VIDEO_ATTRIBUTE = 'data-artisan-autopause';
    const INTERSECT_VERTICAL_MARGIN_PX = 150;
    const INTERSECT_DETECTION_MARGIN = `${INTERSECT_VERTICAL_MARGIN_PX}px ${INTERSECT_VERTICAL_MARGIN_PX}px 0px 0px`;
    const videos = document.querySelectorAll(`video[${TARGET_VIDEO_ATTRIBUTE}]`);
    // Playback control
    const play = (video) => {
        return video.play();
    };
    const pause = (video) => {
        video.pause();
    };
    // Utility to detect videos on screen upon before intersection event.
    const checkIfInViewportAndControlPlayback = (video) => {
        const videoRect = video.getBoundingClientRect();
        const triggerTop = videoRect.top - INTERSECT_VERTICAL_MARGIN_PX, triggerBottom = videoRect.bottom + INTERSECT_VERTICAL_MARGIN_PX;
        const isTopInViewport = triggerTop <= (window.innerHeight || document.documentElement.clientHeight);
        const isBottomInViewport = triggerBottom <= (window.innerHeight || document.documentElement.clientHeight);
        if (isTopInViewport || isBottomInViewport)
            return play(video);
        pause(video);
    };
    // Attach listeners
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        // Create Intersection Observer to detect on/off screen event
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                    return play(entry.target);
                pause(entry.target);
            });
        };
        const observerOpts = {
            root: null,
            rootMargin: INTERSECT_DETECTION_MARGIN,
            threshold: 0
        };
        const observer = new IntersectionObserver(callback, observerOpts);
        observer.observe(video);
    }
})(window, document);
