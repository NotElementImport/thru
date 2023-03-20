import {ThruUtilits} from "./thru.utilits.js";

export class ThruSearch{
    static playedObject = null;

    static init() {
        ThruUtilits.addCss('/css/thru/thru.search.css');
    }

    static async create(element, id) {
        let tags = [];

        element.setAttribute('uid', id);
        let form = document.createElement('form');
        form.method = 'GET';
        let submit = document.createElement('button');
        submit.hidden = true;
        submit.type = 'submit';
        form.appendChild(submit);

        let action = element.getAttribute('action');
        if(action)
            form.action = action;
        else
            form.action = '*';
        
        tags = ThruUtilits.getTagSearch();
        let tagsInput = document.createElement('input');
        let tagsIndex = 0;
        for(let tagName of tags) {
            let tag = document.createElement('span');
            tag.innerHTML = tagName.replaceAll('%20', ' ');
            tag.setAttribute('uix', tagsIndex);
            form.appendChild(tag);

            tag.addEventListener('click', function (e) {
                if (e.offsetX > tag.offsetWidth - 30) {
                    tags.splice(tag.getAttribute('uix'), 1);
                    console.log(tag.getAttribute('uix'));
                    updateTags();
                }
            });

            tagsIndex += 1;
            tagsInput.value = tags.join(',');
        }

        let searcVal = ThruUtilits.getSearchValue();
        let input = document.createElement('input');
        input.value = searcVal;

        let updateTags = () => {
            document.querySelectorAll('span').forEach(element => {
                element.remove();
            });
            let tagsIndex = 0;
            for(const value of tags) {
                let tag = document.createElement('span');
                tag.innerHTML = value.replaceAll('%20', ' ');
                tag.setAttribute('uix', tagsIndex);
                input.before(tag);

                tag.addEventListener('click', function (e) {
                    if (e.offsetX > tag.offsetWidth - 30) {
                        tags.splice(tag.getAttribute('uix'), 1);
                        console.log(tag.getAttribute('uix'));
                        updateTags();
                    }
                });

                tagsIndex += 1;
            }
            tagsInput.value = tags.join(',');
        }

        let funcChange = (e) => {
            let matchTags = input.value.match(/\#([\w\d]*)\w/gm);
            let queryVal = input.value;
            if(matchTags != null) {
                matchTags.forEach((element) => {
                    queryVal = queryVal.replace(element, '');
                    let normalView = element.match(/\B[a-z]([A-Z])/gm);
                    let text = element.replace('#', '');
                    if(normalView != null) {
                        normalView.forEach(sElement => {
                            sElement = sElement.slice(1, 2);
                            text = text.replace(sElement, " "+sElement);
                        });
                    }
                    
                    tags.push(text);
                    input.value = queryVal;
                    searchInput.value = queryVal;
                    updateTags();
                });
            }
            else {
                submit.click();
            }
        };
        input.addEventListener('keydown', (e) => {
            if(e.key == 'Enter') {
                e.preventDefault();
                funcChange();
            }
        });

        input.addEventListener('input', (e) => {
            searchInput.value = input.value;
        });
        element.addEventListener('click', (e) => {
            if(!ThruUtilits.detectMob()) {
                if (e.offsetX > element.offsetWidth - 31) {
                    submit.click();
                }
            }
        });

        form.appendChild(input);
        tagsInput.name = 'tags';
        tagsInput.hidden = true;
        form.appendChild(tagsInput);
        let searchInput = document.createElement('input');
        searchInput.name = 'q';
        searchInput.hidden = true;
        searchInput.value = searcVal;
        form.appendChild(searchInput);
        element.appendChild(form);
    }
}