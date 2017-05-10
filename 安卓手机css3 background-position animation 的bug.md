## 安卓手机background-postion做css3动画时，显示一条白线的bug

### 问题描述
使用渐变的背景图片，通过对background-postion进行偏移来展示渐变动画，但是这个css3动画在播放过程中有一条垂直的白线出现在屏幕上，而且随背景的移动而移动。

code:
```
background-image: url('xxxx.jpg');
background-repeat:no-repeat;
background-size:cover;

keyframe aaa{
    0 {
        background-position:0 0
    }
    100% 
    {
        background-position:100% 0
    }
}
    
```
### 解决方案
将 background-attachment 设置为fixed 可以解决这个问题，background-attachment 是规定背景图像是否固定或者随着页面的其余部分滚动。默认值是scroll。

code:
```
background-image: url('xxxx.jpg');
background-repeat:no-repeat;
background-size:cover;
background-attachment:fixed;
keyframe aaa{
    0 {
        background-position:0 0
    }
    100% 
    {
        background-position:100% 0
    }
}
    
```