function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function removeCookies() {
  let cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}

let cookieConsent = '';
if (getCookie('cookie-consent')) {
  cookieConsent = getCookie('cookie-consent');
  document.querySelector('.cookies').classList.toggle('hidden');
  document.querySelector('#show-consent').classList.toggle('hidden');
}
document.querySelector('#accept-cookies').addEventListener('click', () => {
  setCookie('cookie-consent', 'accept', 30);
  location.reload();
});
document.querySelector('#reject-cookies').addEventListener('click', () => {
  removeCookies();
  setCookie('cookie-consent', 'reject', 30);
  location.reload();
});
document.querySelector('#hide-consent').addEventListener('click', () => {
  document.querySelector('.cookies').classList.toggle('hidden');
  document.querySelector('#show-consent').classList.toggle('hidden');
});
document.querySelector('#show-consent').addEventListener('click', () => {
  document.querySelector('.cookies').classList.toggle('hidden');
  document.querySelector('#show-consent').classList.toggle('hidden');
});


let cardsCount = 0;
if (window.innerWidth < 768) {
  for (let i=0; i<6; i++) {
    document.querySelector('.glide__slides').innerHTML += `<div class="glide__slide two"></div>`;
    cardsCount = 2;
  }
} else {
  for (let i=0; i<3; i++) {
    document.querySelector('.glide__slides').innerHTML += `<div class="glide__slide four"></div>`;
    cardsCount = 4;
  }
}

const gl = new Glide('.glide', { autoplay: 10000, perView: 1 });
gl.mount();

const randomTitles = async () => {
  const res = await fetch(`./api/rnd.php`);
  const json = await res.json();
  return json;
}

const updateSlides = (data) => {
  let iter = 0;
  slides.forEach(slide => {
    slide.innerHTML = '';
    for (let i=0; i<cardsCount; i++) {
      let trailers = data[iter]['trailers'].split(' ');
      let el = 
      `<div class="card-wrapper">
        <div class="card-content">
          <div class="poster">
            <img src="./assets/img/posters/webp/${data[iter]['poster']}.webp" alt="">
          </div>
          <h3 title="${data[iter]['title']} (${parseInt(data[iter]['release_date'])})">${data[iter]['title']}</h3>
          <button class="btn" onclick="showTrailer('${trailers[0]}')">Trailer</button>
        </div>
      </div>`;
      slide.innerHTML += el;
      iter++;
    }
  });
}


const slides = document.querySelectorAll('.glide__slide');
const btnRt = document.querySelector('#rt');
const btns = document.querySelectorAll('.btn');

btns.forEach(btn => {
  btn.addEventListener('click', function(e) {
    
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;
    let ripples = document.createElement('span');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    this.appendChild(ripples);
    setTimeout(() => {ripples.remove()}, 500);
  });
});

btnRt.addEventListener('click', function(e) {
  this.classList.add('inactive');
  randomTitles().then(res => {
    localStorage.setItem('tgm', JSON.stringify(res));
    updateSlides(res);
  });
  rtInactive(30);
});

const rtInactive = (sec) => {
  setInterval(() => {
    sec--;
    if (sec >= 0) {
      btnRt.innerHTML = sec;
    }
    if (sec === 0) {
      clearInterval(sec);
      btnRt.innerHTML = 'Shuffle';
      btnRt.classList.remove('inactive');
    }
 }, 1000);
}


const overlay = document.querySelector('.overlay');
const showTrailer = (t) => {
  if (cookieConsent === 'accept'){
    let trailer = 
      `<div class="trailer">
        <div class="iframe-container">
          <iframe></iframe>
        </div>
      </div>`;
    overlay.innerHTML += trailer;
    document.querySelector('iframe').setAttribute("src", `https://www.youtube-nocookie.com/embed/${t}`);
    overlay.classList.toggle('active');
  } else {
    window.open(`https://www.youtube.com/watch?v=${t}`, "_blank");
  }
}
overlay.addEventListener('click', function(e) {
  e.stopPropagation();
  this.classList.toggle('active');
  document.querySelector('.trailer').remove();
});

window.addEventListener('load', () => {
  if (localStorage.getItem('tgm')) {
    updateSlides(JSON.parse(localStorage.getItem('tgm')));
  } else {
    randomTitles().then(res => {
      localStorage.setItem('tgm', JSON.stringify(res));
      updateSlides(res);
    });
  }
});