//unitTests.whiteSuggar.url
;(function(){
    const assert = chai.assert;
   
    describe('whiteSuggar.url', function(){
        it('userCustomSerialize ', function(){
            const expected = [{name:'key1', value:'value1'}, {name:'key2', value:'value2'}];
            
            const actual = whiteSuggar.url.userCustomSerialize ('#mark','#mark?key1=value1&key2=value2');

            assert.deepEqual(actual, expected);
        });

        it('replaceUrl ', function(){

            const search = 'key1=value1&key2=value2';
            const hash = 'mark';
            whiteSuggar.url.replaceUrl(search, hash);

            assert.strictEqual(window.location.hash, '#' + hash);
            assert.strictEqual(window.location.search, '?' + search);
        });

        it('querySerialize', function(){
            const expected = [{name:'key1', value:'value1'}, {name:'key2', value:'value2'}];

            const search = 'key1=value1&key2=value2';
            const hash = 'mark';
            whiteSuggar.url.replaceUrl(search, hash);

            const actual = whiteSuggar.url.querySerialize();

            assert.deepEqual(actual, expected);
        });
        it('convertSearchString', function(){
            const expected = `t01=001&t02=xxx`;

            const data = {};
            data['t01'] = "001";
            data['t02'] = "xxx";

            const actual = whiteSuggar.url.convertSearchString(data);

            assert.strictEqual(actual, expected);        
        });
        it('convertSearchStringFormData', function(){
            const expected = `t01=001&t02=xxx`;

            const data = new FormData();
            data.append('t01',"001");
            data.append('t02',"xxx");

            const actual = whiteSuggar.url.convertSearchStringFormData(data);

            assert.strictEqual(actual, expected);
        });
        it('convertDictionary', function(){
            const expected = {};
            expected['t01'] = "001";
            expected['t02'] = "xxx";

            const data = new FormData();
            data.append('t01',"001");
            data.append('t02',"xxx");
            
            const actual = whiteSuggar.url.convertDictionary(data);

            assert.deepEqual(actual, expected);
        });
    });

})();