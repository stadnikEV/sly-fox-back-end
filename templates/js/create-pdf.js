"use strict"


const page = document.querySelector('.page');
const stamp = document.querySelector('.stamp');
const signature = document.querySelector('.signature');
page.style.display = "none";
page.style.zIndex = "2";
page.style.position = 'relative';
page.style.backgroundColor = "rgba(255, 255, 255, 0)";
stamp.style.opacity = "0.5";
signature.style.opacity = "0.5";


const background = document.createElement('img');
background.style.width = '595px';
background.classList.add('background');
background.style.position = 'absolute';
background.style.top = '-2px';
background.src = 'http://localhost:3000/images/pdf.jpg';
document.body.prepend(background);


const rotateDegree = (elem) => {
    const matrix = getComputedStyle(elem).getPropertyValue('transform');

    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle +=360 : Math.abs(angle);
}

const defaultPos = {
  stamp: {
    left: parseInt(getComputedStyle(stamp).left),
    top: parseInt(getComputedStyle(stamp).top),
    width: parseInt(getComputedStyle(stamp).width),
    rotate: rotateDegree(stamp),
  },
  signature: {
    left: parseInt(getComputedStyle(signature).left),
    top: parseInt(getComputedStyle(signature).top),
    width: parseInt(getComputedStyle(signature).width),
    rotate: rotateDegree(signature),
  },
  background: {
    top: parseInt(getComputedStyle(background).top),
  },
}

let activeElem = null;


const move = (e) => {
  e.preventDefault();

  if (e.keyCode === 39 && activeElem !== background) {
    activeElem.style.left = `${parseInt(getComputedStyle(activeElem).left) + 1}px`;
    return;
  }
  if (e.keyCode === 37 && activeElem !== background) {
    activeElem.style.left = `${parseInt(getComputedStyle(activeElem).left) - 1}px`;
    return;
  }
  if (e.keyCode === 38) {
    activeElem.style.top = `${parseInt(getComputedStyle(activeElem).top) - 1}px`;
    return;
  }
  if (e.keyCode === 40) {
    activeElem.style.top = `${parseInt(getComputedStyle(activeElem).top) + 1}px`;
    return;
  }
  if (e.keyCode === 187 && !e.shiftKey && activeElem !== background) {
    activeElem.style.width = `${parseInt(getComputedStyle(activeElem).width) + 1}px`;
    return;
  }
  if (e.keyCode === 189 & !e.shiftKey && activeElem !== background) {
    activeElem.style.width = `${parseInt(getComputedStyle(activeElem).width) - 1}px`;
    return;
  }
  if (e.keyCode === 187 && e.shiftKey && activeElem !== background) {
    const currentRotate = rotateDegree(activeElem);
    activeElem.style.transform = `rotate(${currentRotate + 1}deg)`;
    return;
  }
  if (e.keyCode === 189 && e.shiftKey && activeElem !== background) {
    const currentRotate = rotateDegree(activeElem);
    activeElem.style.transform = `rotate(${currentRotate - 1}deg)`;
    return;
  }

}

const focus = (elem) => {
  if (activeElem !== null) {
    return;
  }

  activeElem = elem;
  elem.style.border = "solid 1px gray";
  elem.style.left = `${parseInt(getComputedStyle(elem).left) - 1}px`;
  elem.style.top = `${parseInt(getComputedStyle(elem).top) - 1}px`;
  document.addEventListener('keydown', move);
}

const blur = () => {
  if (!activeElem) {
    return;
  }
  activeElem.style.border = "";
  activeElem.style.left = `${parseInt(getComputedStyle(activeElem).left) + 1}px`;
  activeElem.style.top = `${parseInt(getComputedStyle(activeElem).top) + 1}px`;
  document.removeEventListener('keydown', move);

  let imgName = null;

  switch(activeElem) {
    case stamp:
      imgName = 'stamp';
      break;
    case signature:
      imgName = 'signature';
      break;
    case background:
      imgName = 'background';
      break;
  }

  if (!imgName) {
    return;
  }

  const newPosition = (imgName !== 'background')
    ? {
        left: parseInt(getComputedStyle(activeElem).left),
        top: parseInt(getComputedStyle(activeElem).top),
        width: parseInt(getComputedStyle(activeElem).width),
        rotate: rotateDegree(activeElem),
      }
    : {
        top: parseInt(getComputedStyle(activeElem).top),
      }

  const data = {
    imgName,
    oldPosition: defaultPos[imgName],
    newPosition,
  }

  console.log(data);

  fetch('http://localhost:3000/img', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response.statusText);
      }
      const elem = activeElem;
      defaultPos[imgName] = newPosition;
      elem.style.filter = 'hue-rotate(270deg)';
      setTimeout(() => {
        elem.style.filter = '';
      }, 1000);
      activeElem = null;
    })
    .catch((e) => {
      const elem = activeElem;
      elem.style.filter = 'hue-rotate(140deg)';

      activeElem = null;

      setTimeout(() => {
        elem.style.filter = '';
      }, 1000);

      console.log(e);
    });

}


document.addEventListener('click', (e) => {
  blur(e.target);

  if (!e.target.matches('.stamp') && !e.target.matches('.signature') && !e.target.matches('.background')) {
    return;
  }

  focus(e.target);
});

document.addEventListener('keypress', (e) => {
  if (e.keyCode === 49) {
    background.style.display = "block";
    page.style.display = "none";
    return;
  }
  if (e.keyCode === 50) {
    background.style.display = "none";
    page.style.opacity = 1;
    page.style.display = "block";
    return;
  }
  if (e.keyCode === 51) {
    background.style.display = "block";
    page.style.display = "block";
    page.style.opacity = "0.8";
    return;
  }
});
