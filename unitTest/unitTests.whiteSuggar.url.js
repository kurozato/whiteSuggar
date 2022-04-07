//unitTests.whiteSuggar.url
;(function(){
    const assert = chai.assert;
   
    describe('whiteSuggar.url', function(){

        it('replaceUrl', function(){
            const search = 't01=001&t02=xxx';
            const hash = 'mark';
            const method = 'somethingMethod';
            const data = {};
            data['t01'] = "001";
            data['t02'] = "xxx";

            whiteSuggar.url.replaceUrl({params:data, hash:hash, method:method});

            assert.strictEqual(window.location.hash, '#' + hash);
            assert.strictEqual(window.location.search, '?' + search);
        });

        it('deserialize ', function(){
            const expected = {};
            expected['t01'] = "001";
            expected['t02'] = "xxx";
            
            const actual = whiteSuggar.url.deserialize();
            assert.deepEqual(actual, expected);
        });

        it('deserialize2', function(){

            const hash = 'mark';
            const method = 'somethingMethod';
            const data = {};
            data['t01'] = "日本語";
            data['t02'] = "a B";

            whiteSuggar.url.replaceUrl({params:data, hash:hash, method:method});
            const actual = whiteSuggar.url.deserialize();
      
            assert.deepEqual(actual, data);
        });

    });

})();