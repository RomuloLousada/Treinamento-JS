const start = async () => {
  const devs = await getDevs();

  const nameInput = document.getElementById("nameSearch");
  nameInput.addEventListener('keyup', applyFilters);
  
  const elementsInputs = document.getElementsByName("languageSearch");
  const elementsArray = [...elementsInputs];

  for (let element of elementsArray) {
    element.addEventListener('change', applyFilters);
  }

  createDevsGrid(devs);
};

const getDevs = async () => {
  const devsJson = await fetch('../backend/devs.json');
  const devs = await devsJson.json();
  
  return devs.devs;
};

const applyFilters = async () => {
    let devs = await getDevs();

    devs = filterDevsByName(devs);
    devs = filterDevsByLanguage(devs);

    createDevsGrid(devs);
};

const filterDevsByName = (devs) => {
  const nameInput = document.getElementById("nameSearch");
  let name = formatName(nameInput.value);
  let allDevs = devs;

  if (name !== "") {
    allDevs = devs.filter((dev) => {
      let devName = formatName(dev.name);
      
      if (devName.indexOf(name) !== -1) {
        return dev;
      }
    });
  }

  return allDevs;
};

const formatName = (name) => {
  let formattedName = name;
  formattedName = formattedName.replaceAll(" ", "");
  formattedName = formattedName.toLowerCase();
  formattedName = formattedName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return formattedName;
};

const filterDevsByLanguage = (devs) => {
  const checkboxes = getCheckedCheckboxes();
  const radio = getCheckedRadio();
  
  const filterDevs = devs.filter(({ programmingLanguages }) => {
    const devLanguages = programmingLanguages.map((language) => {
      return language.id;
    });
    
    if (radio === "and") {
      if (devLanguages.length === checkboxes.length) {
        return checkboxes.every((language) => {
          return devLanguages.includes(language);
        });
      } else {
        return false;
      }
    } else {
      return checkboxes.some((language) => {
        return devLanguages.includes(language);
      });
    }
  });
  
  return filterDevs;
};

const getCheckedCheckboxes = () => {
  const checkedCheckboxes = getCheckedElements('language-checkbox');

  const arrayIds = checkedCheckboxes.map((element) => {
    return element.id;
  });
  
  return arrayIds;
};

const getCheckedRadio = () => {
  const checkedRadio = getCheckedElements('language-radio');
  
  return checkedRadio[0].id;
};

const getCheckedElements = (className) => {
  const elements = document.getElementsByClassName(className);
  const elementsArray = [...elements];

  const checkedElements = elementsArray.filter((element) => {
    return element.checked === true;
  });
  
  return checkedElements;
};

const createDevsGrid = (devs) => {
  const devsCount = devs.length;
  replaceDevsCount(devsCount);
  
  const grid = document.getElementById('devsGrid');
  grid.innerHTML = '';
  
  for (let dev of devs) {
    const { name, email, age, picture, programmingLanguages } = dev;
    
    const divCard = document.createElement('div');
    divCard.classList.add('card');
    
    const cardImage = createCardImage(picture);
    const cardContent = createCardContent(name, email, age, programmingLanguages);
    
    divCard.appendChild(cardImage);
    divCard.appendChild(cardContent);
    grid.appendChild(divCard);
  }
};

const replaceDevsCount = (devsCount) => {
  const div = document.getElementById('devsFound');
  div.innerHTML = '';
  const h3 = createElement('h3', 'devs-found');
  
  h3.textContent = createText(devsCount);
  div.appendChild(h3);
};

const createText = (devsCount) => {
  let text = 'Nenhum dev encontrado';
  
  if (devsCount > 0) {
    text = `${devsCount} dev(s) encontrado(s)`;
  }
  
  return text;
};

const createCardImage = (picture) => {
  const imageDiv = createElement('div', 'image-container');

  const imageElement = createElement('img', 'image');
  imageElement.src = picture;

  imageDiv.appendChild(imageElement);

  return imageDiv;
};

const createCardContent = (name, email, age, programmingLanguages) => {
  const contentDiv = createElement('div', 'content-container');
  const textDiv = createElement('div', 'text-container');
  
  const nameSpan = createParagraphElement('Nome', name);
  const emailSpan = createParagraphElement('Email', email);
  const ageSpan = createParagraphElement('Idade', age);
  
  const hrElement = createElement('hr', 'horizontal-line-width');
  
  const languagesDiv = createLanguagesDiv(programmingLanguages);
  
  textDiv.appendChild(nameSpan);
  textDiv.appendChild(emailSpan);
  textDiv.appendChild(ageSpan);
  
  contentDiv.appendChild(textDiv);
  contentDiv.appendChild(hrElement);
  contentDiv.appendChild(languagesDiv);
  
  return contentDiv;
};

const createParagraphElement = (label, value) => {
  const paragraphElement = createElement('p', 'p-margin');
  paragraphElement.textContent += `${label}: ${value}`;
  
  return paragraphElement;
};

const createLanguagesDiv = (programmingLanguages) => {
  const languagesDiv = createElement('div', 'languages-container');
  
  for (let language of programmingLanguages) {
    const filename = language.id.toLowerCase();
    
    const languageImage = createElement('img', 'resize-language-image');
    languageImage.src = `./images/${filename}.png`;
    
    languagesDiv.appendChild(languageImage);
  }
  
  return languagesDiv;
};

const createElement = (elementType, elementClass) => {
  const element = document.createElement(elementType);
  element.classList.add(elementClass);
  
  return element;
};

start();