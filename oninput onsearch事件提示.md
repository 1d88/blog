## oninput
当input或者textarea里面的值发生改变时，立即回触发的事件，比keyup的好处是这个事件是可以捕捉到粘贴复制事件的。他的兼容性也是比较好的，移动端使用很适合。

## onsearch
搜索的事件，此事件在点击搜索、手机上的return，确认都会车发搜索事件，但不太好的一点是火狐浏览器对其不兼容，此时我们可以写个hack
```
var input = document.createElement('input');

if( 'onsearch' in input ){
    delete input;
    //这说明浏览器是支持这个事件的
}else{
    //只好使用keyup事件了
    
    element.addEventListener('keyup',function(e){
        
            if(e.keyCode === 13){
                //TODO                
            }
    },false);
}

```