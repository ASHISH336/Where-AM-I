'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// //////////////////////////////////////////////////

const renderCountry = function (data, className = '') {
  const flag = data.flags.svg;
  const countryName = data.name.common;
  const region = data.region;
  const population = (data.population / 1000000).toFixed(2);
  const language = Object.values(data.languages)[0];
  const currency = Object.values(data.currencies)[0].name;

  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${flag}" />
    <div class="country__data">
      <h3 class="country__name">${countryName}</h3>
      <h4 class="country__region">${region}</h4>
      <p class="country__row"><span>👫</span>${population} million people</p>
      <p class="country__row"><span>🗣️</span>${language}</p>
      <p class="country__row"><span>💰</span>${currency}</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })
    .then(response => response.json())
    .then(data => {
      getJSON(
        `https://restcountries.com/v3.1/alpha/${data.countryCode}`,
        'Country not found'
      )
        .then(data => {
          renderCountry(data[0]);
        })
        .catch(err => {
          console.error(`${err} 🌋🌋🌋`);

          renderError(`Something went wrong 🌋🌋🌋${err.message}.Try again!`);
        })
        .finally(() => {
          countriesContainer.style.opacity = 1;
        });
    });
};

btn.addEventListener('click', whereAmI);

// prettier-ignore
/////////////////////////////////////////////////////////////////////////////////////////////////////

// const getCountryAndNeighbour = function (country) {
//   //AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);

//     //Render Country
//     //console.log(data);
//     renderCountry(data);

//     //Get neighbour country
//     const neighbour = data.borders?.[0];

//     if (!neighbour) return;

//     //AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request2.send();
//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// whereAmI(52.508, 13.381);

//Building Promises
//Encapsulating asynchronus behavior into promises
// const lotteryPromise = new Promise(function (resolve, reject) {
//It is not asynchoronus till now
// if (Math.random() >= 0.5) {
//   resolve('YOU WIN!!!');
// } else {
//   reject('YOU LOSE!!!');
// }

//Making it asynchronus
//   console.log('Lottery draw is happening');
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve('YOU WIN!!!');
//     } else {
//       reject(new Error('YOU LOSE!!!'));
//     }
//   }, 2000);
// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

//Promisifying wait function

// const wait = seconds =>
//   new Promise(resolve => setTimeout(resolve, seconds * 1000));

// wait(2).then(() => console.log(`I waited 2 seconds.`));

// const getCountryData = function (country) {
//   getJSON(
//     `https://restcountries.com/v3.1/alpha/${country}`,
//     'Country not found'
//   )
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders?.[0];

//       if (!neighbour) throw new Error('No neighbour found!');

//       return getJSON(
//         `https://restcountries.com/v3.1/alpha/${neighbour}`,
//         'Neighbour not found'
//       );
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err} 🌋🌋🌋`);

//       renderError(`Something went wrong 🌋🌋🌋${err.message}.Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };
