# whiteSuggar

write in pure javascript.    
for company's internal system.    

- elements filtering.
- replace url, convert query to keyValuePair.
- table paging (pagination).

Using jsDelivr CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/kurozato/whiteSuggar@1.0.1/dist/whiteSuggar.js"></script>
```

## whiteSuggar.filtering
elements filtering.    

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

replace url, convert query to keyValuePair.   
'replaceUrl' use 'history.pushState'.

Quick Start
```js
//send data
const data = {};
data['p01'] = 'Xxx';
data['p02'] = '0000';

//before -> https://host/mysite/index.html
whiteSuggar.url.replaceUrl({params: data, hash: 'submit', method: 'whiteSuggar.url.replaceUrl'});
//After -> https://host/mysite/index.html?p01=Xxx&p02=0000#submit

const qry = whiteSuggar.url.deserialize();
//qry = {p01: 'Xxx', p02: '0000'};
```

## whiteSuggar.table

paging system. and make table.  

this module using bootstrap 5.    
but not using bootstrap 5, this module works.    
css :
``` html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
```
js (not need) :
``` html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
```

Quick Start
```js
const _data = _service.getData();
const pagingContent = document.getElementById('pagingContent');

whiteSuggar.table.pagination(
    pagingContent,
    _data,
    5,
    (pageNo, data, content) => {
        whiteSuggar.table.buildSimpleTables({
            element: content,
            columns:[
                {data: "No", title:"#" , class:"col-width-1", visible:true, render: null, customAttribute:`scope="col"`},
                {data: "Name", title:"Name" , class:"col-wd-5", visible:true, render: null},
                {data: "Age", title:"Age" , class:"col-wd-2", visible:true, render: (data) => {return `<small>${data}</small>`;}},
                {data: "Id", title:"ID" , class:"", visible:fales, render: null}
            ],
            data: data,
            initialize: true});
        whiteSuggar.table.addClassByClassName('upd-simple-table-title', 'table');
        whiteSuggar.table.addClassByClassName('upd-simple-table-content', 'table');
});
```
config of buildSimpleTables
{element, columns, data, initialize}

| proparty | comment |
|---|---|
| element | appended of table |
| columns | see -> columns of config |
| data | data |
| initialize | element initialize ('true' inner clear) |

columns of config :    
{column: string, label: string, class: string, visible: boolean, render: function, customAttribute: string}

| proparty | comment |
|---|---|
| column | data column name |
| title | table header title |
| class | className (add class) |
| visible | column visible ('false' add display:none;) |
| render | return innerHTML |
| customAttribute | Attribute 'name="value"' |

# Japanese
素のjsで書いているため、プラグインは不要（PagingのみBootstrapがいる）    
業務系の社内システム用    

URL操作と、フィルタリング、ページング実装の3つ。    

ページングは、Bootstrap5のCSSを導入しないと、いい感じにならない。    
columnsについては、DataTablesに寄せている。    
DataTablesが、脱jQueryしたら、いらない子。。。え？しないの？？
