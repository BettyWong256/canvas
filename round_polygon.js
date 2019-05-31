(function($) {
    var data = {
        ctx: null,
        pA: [],
        f_pA:[],
        loop_num: 0,
    };
    var methods = {
        init : function(options) {
            var settings = $.extend({
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
            }, options);

            data.settings = settings;
            return this.each(function() {
                var $this = $(this);
                methods._drawPolygon.call($this, settings);
            });
        },
        // 绘制直线
        _drawLine : function(){
            var N = data.settings.N;
            for(let i =0;i <= N; i++){
                if (i) {
                    data.ctx.lineTo(data.f_pA[i].x,data.f_pA[i].y);
                } else {
                    data.ctx.moveTo(data.f_pA[i].x, data.f_pA[i].y);
                }
            }
        },
        // 绘制圆角
        _drawRadius : function(){
            var N = data.settings.N,r = data.settings.radius;
            for(let i =0;i <= N; i++){
                if(i == 0){
                    data.ctx.moveTo(data.pA[i].x, data.pA[i].y);
                    data.ctx.arcTo(data.f_pA[i].x,data.f_pA[i].y,data.f_pA[i+1].x,data.f_pA[i+1].y,r);
                } else if (i == N) {
                    data.ctx.lineTo(data.pA[i].x, data.pA[i].y);
                } else {
                    data.ctx.lineTo(data.pA[i].x, data.pA[i].y);
                    data.ctx.arcTo(data.f_pA[i].x,data.f_pA[i].y,data.f_pA[i+1].x,data.f_pA[i+1].y,r);
                }
            }
        },

        // 多边形绘制
        _drawPolygon : function(settings) {
            var self = this;
            self.attr("width",settings.width);
            self.attr("height",settings.height);

            var ctx = self.get(0).getContext("2d");
            ctx.beginPath();
            data.ctx = ctx;

            var b = 90 - 180/settings.N;  // 1/2夹角角度
            var x = settings.width * 0.5, y = settings.height * 0.5; // 图形中心点坐标,建议为canvas中心点
            var new_x = (settings.side-Math.cos(Math.PI/180*(b))*settings.radius);
            var new_y = Math.sin(Math.PI/180*(b))*settings.radius;
            var new_R = Math.sqrt(settings.side*settings.side+settings.radius*settings.radius-2*settings.side*settings.radius* Math.cos(Math.PI/180*b));
            var new_a = settings.row - Math.atan(new_y/new_x) / (Math.PI/180);
           
            // 采集基准点、辅助线起止点坐标
            for(let i = 0 ;i <= settings.N; i++){
                var point = {},f_point={};
                point.x = x+ Math.cos(Math.PI/180* (new_a+360/settings.N *i)) * new_R;
                point.y = y+ Math.sin(Math.PI/180* (new_a+360/settings.N *i)) * new_R; 
                data.pA.push(point);


                f_point.x = x+ Math.cos(Math.PI/180* (settings.row+360/settings.N *i)) * settings.side;
                f_point.y = y+ Math.sin(Math.PI/180* (settings.row+360/settings.N *i)) * settings.side; 
                data.f_pA.push(f_point);
            }

            // console.log(data.pA);
            // console.log(x+new_x,y+new_y);

            if (settings.has_round){
                methods._drawRadius();
            } else {
                methods._drawLine();
            }

            if (settings.fill_style == 1){
                ctx.fillStyle = settings.fill_color;
                ctx.fill();
            } else if (settings.fill_style == 3){
                ctx.clip();
            } else {
                ctx.fillStyle = settings.fill_color;
                ctx.stroke();
            } 
            
            if(settings.img_url){
                var img = new Image();
                img.src = settings.img_url;
                img.onload = function() {
                    data.img = img;
                    methods._drawImg();
                }
            }    
        },
        // 图片截取
        _drawImg: function(){
            if(data.times){
                window.cancelAnimationFrame(data.times);
            }
            data.loop_num = 0;
            data.ctx.clearRect(0,0,data.settings.width,data.settings.height);
            
            let ox = (data.settings.width - data.settings.img_width)/2;
            let oy = (data.settings.height - data.settings.img_height)/2;
            data.ctx.drawImage(data.img,ox,oy,data.settings.img_width,data.settings.img_height);
        },

        // 纹理缩放效果
        _loopScale: function(){
            data.ctx.clearRect(0,0,data.settings.width,data.settings.height);
            let loop_x = data.settings.img_width * (1 + data.loop_num * data.settings.scale_speed);
            let loop_y = data.settings.img_height * (1 + data.loop_num * data.settings.scale_speed);
            let ox = (data.settings.width - loop_x)/2;
            let oy = (data.settings.height - loop_y)/2;
            data.ctx.drawImage(data.img,ox,oy,loop_x,loop_y);
            if( data.loop_num * data.settings.scale_speed + 1 < data.settings.scale_max){
                data.loop_num++;
                data.times = window.requestAnimationFrame(methods._loopScale, data.ctx);
            }  
        },
        destroy : function() {
            return this.each(function() {
                var $this = $(this);
                $this.html("");
            });
        }
    };

    $.fn.roundedPolygon = function(method) {
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if( typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
})(jQuery);