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

    describe('whiteSuggar.filtering', function(){
        it('likeMatch ', function(){
            const box = document.createElement('div');
            box.innerText = 'testXxx'
            const expected = true;
            const actual = whiteSuggar.filtering.likeMatch('test', box);

            assert.strictEqual(actual, expected);
        });

        it('match ', function(){
            const box = document.createElement('div');
            box.innerText = 'testXxx'
            const expected = false;
            const actual = whiteSuggar.filtering.match('test', box);

            assert.strictEqual(actual, expected);
        });

        it('filter ', function(){
            const box = document.createElement('div');
            document.getElementById('domTestsAria').append(box);
            for (let i = 0; i < aryTest.length; i++) {
                const li = document.createElement('li');
                li.innerText = aryTest[i]['No'] + ':' + aryTest[i]['Data'];
                box.append(li);
            }

            whiteSuggar.filtering.filter(box, 'li', (li) => whiteSuggar.filtering.likeMatch('XXXX', li));
        });
    });
})();