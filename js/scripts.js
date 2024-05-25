document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
});

let totalRotation = 0;

document.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    totalRotation = scrollTop;
    document.documentElement.style.setProperty('--rotation', `${totalRotation}deg`);
});
