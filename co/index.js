"use strict";
const async = (genFn) => (...args) => {
    return new Promise((resolve, reject) => {
        const gen = genFn();
        const next = (result) => {
            if (result.done)
                return resolve(result.value);
            Promise.resolve(result.value).then(onFulfilled, onRejected);
        };
        const onFulfilled = (res) => {
            let result;
            try {
                result = gen.next(res);
            }
            catch (e) {
                return reject(e);
            }
            next(result);
        };
        const onRejected = (err) => {
            let result;
            try {
                result = gen.throw(err);
            }
            catch (e) {
                return reject(e);
            }
            next(result);
        };
        onFulfilled(undefined);
    });
};
// let getData = async(function * (url: string) {
//   let result: Response = yield fetch(url)
//   let json = yield result.json()
//   return json
// })
// getData('sxx')
// let getD = async (url: string) => {
//   let result = await fetch(url)
//   let json = await result.json()
//   return json
// }
console.log('script start');
let async1 = async(function* () {
    yield async2();
    console.log('async1 end');
});
let async2 = async(function* () {
    console.log('async2 end');
});
async1();
setTimeout(function () {
    console.log('setTimeout');
}, 0);
new Promise(resolve => {
    console.log('Promise');
    resolve();
})
    .then(function () {
    console.log('promise1');
})
    .then(function () {
    console.log('promise2');
});
console.log('script end');


const t = async(function * () {
  try {
    const data = yield fetch('http://hah.com').then(j => j.json())
  } catch (e) {
    console.log('awwa')
  }
})
// const t = async () => {
//   try {
//     const data = await fetch('http://hah.com').then(j => j.json())
//   } catch (e) {
//     console.log('awwa')
//   }
// }

// try {
//   t()
// } catch (e) {
//   console.log('wawa')
// }
t()