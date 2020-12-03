import './movie-card.js';

// Based on window width create glide slides
// If slides are removed when the shuffle btn is clicked,
// the glider malfunctions
// ToDo: test more 
let cardsCount = 0;
if (window.innerWidth < 768) {
  for (let i=0; i<12; i++) {
    document.querySelector('.glide__slides').innerHTML += `<div class="glide__slide two"></div>`;
    cardsCount = 2;
  }
} else {
  for (let i=0; i<6; i++) {
    document.querySelector('.glide__slides').innerHTML += `<div class="glide__slide four"></div>`;
    cardsCount = 4;
  }
}
const shuffleBtn = document.querySelector('#shuffle');
const lclSt = 'tgm';
const gl = new Glide('.glide', { autoplay: 15000, perView: 1 }).mount();
const slides = document.querySelectorAll('.glide__slide');


// API 
const rndTitles = async () => {
  const res = await fetch(`./api/rnd.php`);
  const json = await res.json();
  // set LOCALSTORAGE
  // ToDo encode response
  localStorage.setItem(lclSt, JSON.stringify(json));
  return json;
}



// Update Slides
const updateSlides = (movies) => {
  gl.update({ startAt: 0 });
  let mi = 0;
  slides.forEach(slide => {
    slide.innerHTML = '';
    for (let i=0; i<cardsCount; i++) {
      const card = document.createElement('movie-card');
      card.movie = movies[mi];
      slide.appendChild(card);
      mi++;
    }
  })
}



// Shuffle BTN
shuffleBtn.addEventListener('click', function(e) {
  let x = e.clientX - e.target.offsetLeft;
  let y = e.clientY - e.target.offsetTop;
  let ripples = document.createElement('span');
  ripples.style.left = x + 'px';
  ripples.style.top = y + 'px';
  this.appendChild(ripples);
  setTimeout(() => {ripples.remove()}, 500);
  this.classList.add('inactive');
  rtInactive(15);
  rndTitles().then(res => updateSlides(res));
});
const rtInactive = (sec) => {
  setInterval(() => {
    sec--;
    if (sec >= 0) {
      shuffleBtn.innerHTML = 'Shuffle in ' + sec;
    }
    if (sec === 0) {
      clearInterval(sec);
      shuffleBtn.innerHTML = 'Shuffle';
      shuffleBtn.classList.remove('inactive');
    }
 }, 1000);
}



// Window Load
window.addEventListener('load', () => {
  if (localStorage.getItem(lclSt)) {
    updateSlides(JSON.parse(localStorage.getItem(lclSt)));
  } else {
    rndTitles().then(res => {
      localStorage.setItem(lclSt, JSON.stringify(res));
      updateSlides(res);
    });
  }
});



// OVERLAY
const overlay = document.querySelector('.overlay');
const showTrailer = (t) => {
  let ytId = t.split(' ')[0];
  if (getCookie('cookie-consent') === 'accept'){
    gl.update({ autoplay: 0 });
    overlay.innerHTML +=  
      `<div class="overlay-trailer">
        <div class="overlay-close" id="ovcl">
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path fill="none" d="M12.71,7.291c-0.15-0.15-0.393-0.15-0.542,0L10,9.458L7.833,7.291c-0.15-0.15-0.392-0.15-0.542,0c-0.149,0.149-0.149,0.392,0,0.541L9.458,10l-2.168,2.167c-0.149,0.15-0.149,0.393,0,0.542c0.15,0.149,0.392,0.149,0.542,0L10,10.542l2.168,2.167c0.149,0.149,0.392,0.149,0.542,0c0.148-0.149,0.148-0.392,0-0.542L10.542,10l2.168-2.168C12.858,7.683,12.858,7.44,12.71,7.291z M10,1.188c-4.867,0-8.812,3.946-8.812,8.812c0,4.867,3.945,8.812,8.812,8.812s8.812-3.945,8.812-8.812C18.812,5.133,14.867,1.188,10,1.188z M10,18.046c-4.444,0-8.046-3.603-8.046-8.046c0-4.444,3.603-8.046,8.046-8.046c4.443,0,8.046,3.602,8.046,8.046C18.046,14.443,14.443,18.046,10,18.046z"></path>
            </svg>
        </div>
        <div class="iframe-container">
          <iframe src="https://www.youtube-nocookie.com/embed/${ytId}"></iframe>
        </div>
      </div>`;
    overlay.classList.toggle('active');
  } else {
    window.open(`https://www.youtube.com/watch?v=${ytId}`, "_blank");
  }
}
const showDetails = (id) => {
  let movies = JSON.parse(localStorage.getItem(lclSt));
  for (let movie of movies) {
    if (movie['id'] === id) {
      gl.update({ autoplay: 0 });
      overlay.innerHTML += 
      `<div class="overlay-details">
        <div class="overlay-close" id="ovcl">
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path fill="none" d="M12.71,7.291c-0.15-0.15-0.393-0.15-0.542,0L10,9.458L7.833,7.291c-0.15-0.15-0.392-0.15-0.542,0c-0.149,0.149-0.149,0.392,0,0.541L9.458,10l-2.168,2.167c-0.149,0.15-0.149,0.393,0,0.542c0.15,0.149,0.392,0.149,0.542,0L10,10.542l2.168,2.167c0.149,0.149,0.392,0.149,0.542,0c0.148-0.149,0.148-0.392,0-0.542L10.542,10l2.168-2.168C12.858,7.683,12.858,7.44,12.71,7.291z M10,1.188c-4.867,0-8.812,3.946-8.812,8.812c0,4.867,3.945,8.812,8.812,8.812s8.812-3.945,8.812-8.812C18.812,5.133,14.867,1.188,10,1.188z M10,18.046c-4.444,0-8.046-3.603-8.046-8.046c0-4.444,3.603-8.046,8.046-8.046c4.443,0,8.046,3.602,8.046,8.046C18.046,14.443,14.443,18.046,10,18.046z"></path>
            </svg>
        </div>
        <div class="mdetails">
          <div class="mp">
          <img loading="lazy" src="./assets/img/posters/webp/${movie['poster']}.webp" alt="${movie['title']}">
          </div>
          <div class="md">
            <h2>${movie['title']} <span>(${parseInt(movie['release_date'])})</span></h2>
            <h3><span>${movie['genres']}</span><span>${movie['runtime']} min</span></h3>
            <p>${movie['overview']}</p>
            <a href="https://www.themoviedb.org/movie/${movie['tmdb']}" target="_blank" rel="noopener noreferrer" title="Link to TMDB page">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 273.42 35.52"><defs><style>.cls-1{fill:url(#linear-gradient);}</style><linearGradient id="linear-gradient" y1="17.76" x2="273.42" y2="17.76" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#90cea1"/><stop offset="0.56" stop-color="#3cbec9"/><stop offset="1" stop-color="#00b3e5"/></linearGradient></defs><title>Asset 3</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M191.85,35.37h63.9A17.67,17.67,0,0,0,273.42,17.7h0A17.67,17.67,0,0,0,255.75,0h-63.9A17.67,17.67,0,0,0,174.18,17.7h0A17.67,17.67,0,0,0,191.85,35.37ZM10.1,35.42h7.8V6.92H28V0H0v6.9H10.1Zm28.1,0H46V8.25h.1L55.05,35.4h6L70.3,8.25h.1V35.4h7.8V0H66.45l-8.2,23.1h-.1L50,0H38.2ZM89.14.12h11.7a33.56,33.56,0,0,1,8.08,1,18.52,18.52,0,0,1,6.67,3.08,15.09,15.09,0,0,1,4.53,5.52,18.5,18.5,0,0,1,1.67,8.25,16.91,16.91,0,0,1-1.62,7.58,16.3,16.3,0,0,1-4.38,5.5,19.24,19.24,0,0,1-6.35,3.37,24.53,24.53,0,0,1-7.55,1.15H89.14Zm7.8,28.2h4a21.66,21.66,0,0,0,5-.55A10.58,10.58,0,0,0,110,26a8.73,8.73,0,0,0,2.68-3.35,11.9,11.9,0,0,0,1-5.08,9.87,9.87,0,0,0-1-4.52,9.17,9.17,0,0,0-2.63-3.18A11.61,11.61,0,0,0,106.22,8a17.06,17.06,0,0,0-4.68-.63h-4.6ZM133.09.12h13.2a32.87,32.87,0,0,1,4.63.33,12.66,12.66,0,0,1,4.17,1.3,7.94,7.94,0,0,1,3,2.72,8.34,8.34,0,0,1,1.15,4.65,7.48,7.48,0,0,1-1.67,5,9.13,9.13,0,0,1-4.43,2.82V17a10.28,10.28,0,0,1,3.18,1,8.51,8.51,0,0,1,2.45,1.85,7.79,7.79,0,0,1,1.57,2.62,9.16,9.16,0,0,1,.55,3.2,8.52,8.52,0,0,1-1.2,4.68,9.32,9.32,0,0,1-3.1,3A13.38,13.38,0,0,1,152.32,35a22.5,22.5,0,0,1-4.73.5h-14.5Zm7.8,14.15h5.65a7.65,7.65,0,0,0,1.78-.2,4.78,4.78,0,0,0,1.57-.65,3.43,3.43,0,0,0,1.13-1.2,3.63,3.63,0,0,0,.42-1.8A3.3,3.3,0,0,0,151,8.6a3.42,3.42,0,0,0-1.23-1.13A6.07,6.07,0,0,0,148,6.9a9.9,9.9,0,0,0-1.85-.18h-5.3Zm0,14.65h7a8.27,8.27,0,0,0,1.83-.2,4.67,4.67,0,0,0,1.67-.7,3.93,3.93,0,0,0,1.23-1.3,3.8,3.8,0,0,0,.47-1.95,3.16,3.16,0,0,0-.62-2,4,4,0,0,0-1.58-1.18,8.23,8.23,0,0,0-2-.55,15.12,15.12,0,0,0-2.05-.15h-5.9Z"/></g></g></svg>
            </a>
          </div>
        </div>
      </div>`;
    }
  }
  overlay.classList.toggle('active');
}



// COOKIES
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
const getCookie = (name) => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
const removeSiteCookies = () => {
  let cookies = document.cookie.split("; ");
  for (let c = 0; c < cookies.length; c++) {
    let d = window.location.hostname.split(".");
    while (d.length > 0) {
      let cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
      let p = location.pathname.split('/');
      document.cookie = cookieBase + '/';
      while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
      };
      d.shift();
    }
  }
}
if (getCookie('cookie-consent') === null) {
  document.querySelector('.cookies').classList.toggle('hidden');
  document.querySelector('#show-consent').classList.toggle('hidden');
}



// CLICK EVENTS
document.onclick = function(e) {
  // View trailer btn
  if (e.target.dataset['trailers']) {
    showTrailer(e.target.dataset['trailers']);
  }
  // View details btn
  if (e.target.dataset['mid']) {
    showDetails(e.target.dataset['mid']);
  }

  // Overlay click to close
  if (e.target.id === 'overlay' || e.target.id === 'ovcl') {
    overlay.classList.toggle('active');
    overlay.innerHTML = '';
    gl.update({ autoplay: 15000 });
  }

  // Accept cookies btn
  if (e.target.id === 'accept-cookies') {
    setCookie('cookie-consent', 'accept', 30);
    location.reload();
  }
  // Reject cookies btn
  if (e.target.id === 'reject-cookies') {
    removeSiteCookies();
    setCookie('cookie-consent', 'reject', 30);
    location.reload();
  }
  // Show cookie conset btn
  if (e.target.id === 'show-consent') {
    document.querySelector('.cookies').classList.toggle('hidden');
    document.querySelector('#show-consent').classList.toggle('hidden');
  }
  // Hide cookie conset btn
  if (e.target.id === 'hide-consent') {
    document.querySelector('.cookies').classList.toggle('hidden');
    document.querySelector('#show-consent').classList.toggle('hidden');
  }
}