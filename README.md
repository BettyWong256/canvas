# canvas
canvas绘制多边形圆角

文件实例用于JQ插件，wiki中有非完整版js逻辑。

# 初始化方法
$("#canvas").roundedPolygon(options）; 
options = {
  width : 400,//画布宽度
  height : 400 ,//画布高度
  N:4, // N边形
  side: 100, // 边长 
  row: 0, // 起始点偏移角度a
  radius:10, // 夹角圆弧半径,
  has_round: false, // 是否圆角
  fill_style: 2, // 填充1,边框2,路径截取3
  fill_color: '#000', // 填充色
  img_url: '',
  img_width: 200,
  img_height: 200,
  scale_speed: 0.01, // 缩放速度
  scale_max: 1.5
}

# 其他方法
_drawImg() 简单的纹理填充
_loopScale() 可实现纹理缩放的调用
