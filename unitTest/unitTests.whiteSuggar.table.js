//unitTests.whiteSuggar.table
;(function(){
const assert = chai.assert;

const aryTest = [
    {No:0 ,Data:'X'},
    {No:1 ,Data:'Xx'},
    {No:2 ,Data:'Xxx'},
    {No:3 ,Data:'XX'},
    {No:4 ,Data:'XXx'},
    {No:5 ,Data:'XXxx'},
    {No:6 ,Data:'XXX'},
    {No:6 ,Data:'XXXx'},
    {No:7 ,Data:'XXXxx'},
    {No:8 ,Data:'XXXX'},
    {No:9 ,Data:'XXXXx'},
    {No:10 ,Data:'XXXXxx'},
    {No:11 ,Data:'XXXXX'},
];
describe('whiteSuggar.table', function(){
    it('addClassByClassName ', function(){
        console.log(whiteSuggar);
        const _box = document.createElement('div');
        _box.classList.add('ut-1');
        document.getElementById('domTestsAria').appendChild(_box);

        whiteSuggar.table.addClassByClassName('ut-1', 'ut-2-add');

        assert.isTrue(_box.classList.contains('ut-2-add'));
    });
    
    it('buildSimpleTables' ,function(){
        const _box = document.createElement('div');
        document.getElementById('domTestsAria').appendChild(_box);
        whiteSuggar.table.buildSimpleTables({
            element: _box,
            columns:[
                {data: "No", title:"#" , class:"col-width-1", visible:true, render: null, customAttribute:`scope="col"`},
                {data: "Data", title:"Name" , class:"col-width-5", visible:true, render: null},
                {data: "No-Data", title:"No-Data" ,  visible:true, render: function(row){return `<span>${row['No']}-${row['Data']}</span>`;}},
            ],
            data: aryTest,
            initialize: true});

        whiteSuggar.table.addClassByClassName('upd-simple-table-title', 'table');
        whiteSuggar.table.addClassByClassName('upd-simple-table-content', 'table');
    });

    it('pagination' ,function(){

        const _box = document.createElement('div');
        _box.id='pagination-simple';
        document.getElementById('domTestsAria').appendChild(_box);
        whiteSuggar.table.pagination(
            _box,
            aryTest,
            2,
            (pageNo, data, content) => {
                console.log({page:pageNo, data:data});
                let _inner = `- Page:${pageNo.toString()} -`;
                data.forEach((val)=>{
                    _inner = _inner + `<br>No:${val['No']} Data:${val['Data']}`; 
                })
                content.innerHTML = _inner;
            });
    });



    it('pagination table' ,function(){
        const _box = document.createElement('div');
        _box.id='pagination-table';
        document.getElementById('domTestsAria').appendChild(_box);
        whiteSuggar.table.pagination(
            _box,
            aryTest,
            3,
            (pageNo, data, content) => {
                whiteSuggar.table.buildSimpleTables({
                    element: content,
                    columns:[
                        {data: "No", title:"#" , class:"col-width-1", visible:true, render: null, customAttribute:`scope="col"`},
                        {data: "Data", title:"Name" , class:"col-width-5", visible:true, render: null},
                        {data: "No-Data", title:"No-Data" ,  visible:true, render: function(row){return `<span>${row['No']}-${row['Data']}</span>`;}},
                    ],
                    data: data,
                    initialize: true});
                whiteSuggar.table.addClassByClassName('upd-simple-table-title', 'table');
                whiteSuggar.table.addClassByClassName('upd-simple-table-content', 'table');
            });

    });
});

})();