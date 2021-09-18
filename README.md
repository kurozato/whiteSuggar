# whiteSuggar

write in pure javascript.

- elements filtering.
- replace url, convert query to array.

Using jsDelivr CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/kurozato/whiteSuggar@1.0.0/dist/whiteSuggar.js"></script>
```

## whiteSuggar.filtering
elements filtering.    
write in pure javascript.     

Quick Start
```js
//get element 
const table0 = document.getElementById('table0');

//View Only: ID or Name contain 'XXxxXx'
whiteSuggar.filtering.filter(
    table0,
    'tr',
    (row) => whiteSuggar.filtering.likeMatch('XXxxXx', row));
    
```
Use Main:   
filtering by user input contents.
```js
const input = document.getElementById('input0');

input.addEventListener('input', function(e){

    const box = document.getElementById('box0');
    
    whiteSuggar.filtering.filter(
        box,
        'li',
        (li) => whiteSuggar.filtering.likeMatch(e.target.value, li));
});    
```

## whiteSuggar.url

replace url, convert query to array.    
write in pure javascript.

Quick Start
```js
//get serialize form
const form0 = document.getElementById('form0');
const data = new FormData(form0);

const searchString = whiteSuggar.url.convertSearchString(data);
//before -> https://host/mysite/index.html
whiteSuggar.url.replaceUrl(searchString, 'submit');
//After -> https://host/mysite/index.html?name0=value0&name1=value1&name2=value2#submit

const qry = whiteSuggar.url.querySerialize();
//qry = [{name:name0, value:value0}, {name:name1, value:value1}, {name:name2, value:value2}];
```
