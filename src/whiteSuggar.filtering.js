const whiteSuggar = window.whiteSuggar || {};

whiteSuggar.filtering = whiteSuggar.filtering || {};

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} elementName 
 * @param {Function} expression 
 */
whiteSuggar.filtering.filter = function(element, elementName, expression){
    const targets = element.getElementsByTagName(elementName);
    for(let i = 0; i < targets.length; i++){
        if(expression(targets[i]) === true){
            targets[i].style.display = '';
        }
        else{
            targets[i].style.display = 'none';
        }
    }
};

/**
 * return row content contain 'key'.
 * @param {string} key -  key
 * @param {HTMLElement} element - target
 * @returns {boolean}
 */
 whiteSuggar.filtering.likeMatch = function (key, element) {
    return element.innerText.indexOf(key) > -1;
};

/**
 * return row content equal 'key'.
 * @param {string} key -  key
 * @param {HTMLElement} element - target
 * @returns {boolean}
 */
whiteSuggar.filtering.match = function (key, element) {
    return element.innerText === key;
};
