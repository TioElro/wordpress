/*
@licstart  The following is the entire license notice for the 
JavaScript code in this page.
Copyright (C) 2016 Bijaya Baniya
PieBuilder-js-plugin-1.1.1
This Freeware License Agreement (the "Agreement") is a legal agreement between you ("Licensee"), the end-user, and Bijaya Baniya for the use of this software product ("Software"). Commercial as well as non-commercial use is allowed. By using this Software or storing this program or parts of it on a computer hard drive (or other media), you agree to be bound by the terms of this Agreement. Provided that you verify that you are handling the original freeware version you are hereby licensed to make as many copies of the freeware version of this Software and documentation as long as you do not charge money or request donations for such copies. You may not alter this Software in any way. You may not modify, rent or sell this Software, or create derivative works based upon this Software.
@licend  The above is the entire license notice for the JavaScript code in this page. 

The Implementation part of this Js
  var myModal = new PieBuilder({
            dataList: [80, 200 , 80],
            dataLabelList: ['Programming', 'Design', 'Development'],
            datathresholdDistance: [100, 10, 30],//this must be adjust according to 
            colorList: ["#FFDAB9", "#E6E6FA", "#E0FFFF",],
            radiusList: [100, 120, 100],
            focusPie:1,//keep the focus pie with the highest radius 
            fontSize: '18',//px 
            fontFamily: 'Helvetica',
            canvasID: 'piechart',
            labelColor:'#9b9b9b',
            percentageColor: '#000'
        });
*/
(function () {
    // Define our constructor
    this.PieBuilder = function () {
        var defaults = {
            dataList: [],
            colorList: [],
            radiusList: "",
            canvasID: '',
            percentage: [],
            centerX: 0,
            centerY: 0,
            fontSize: 0,
            fontVarient: '',
            dataLabelList: [],
            fontFamily: 'ariel',
            labelColor: '',
            datathresholdDistance: [],
            percentageColor: '#000',
            focusPie: 0,
            whiteCircle: 15,
            changeAdditional: 0,
            percentageFontFamily: 'ariel',
            percentageFontSize: '18',
            percentageFontVarient: 'bold'
        }
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
        this.options.canvas = document.getElementById(this.options.canvasID);
        this.options.context = this.options.canvas.getContext("2d");
        this.options.centerX = Math.floor(this.options.canvas.width / 2);
        this.options.centerY = Math.floor(this.options.canvas.height / 2);
        this.DrawCanvas(this.options.whiteCircle);
    }

    PieBuilder.prototype.DrawCanvas = function (whiteCircle) {
        var dataLength = this.options.percentage.length;
        var total = 0;
        for (var i = 0; i < dataLength; i++) {
            total += this.options.percentage[i];
            this.options.dataList.push(this.options.percentage[i] * 3.6);
        }
        for (var i = 0; i < dataLength; i++) {
            //this.options.percentage.push(Math.round((this.options.dataList[i] * 100) / total));
            this.DrawSegment(i);
        }
        this.DrawSamllCircle(this.options.centerX, this.options.centerY, "#FFF", whiteCircle);
    }

    PieBuilder.prototype.DrawSamllCircle = function (xCor, yCor, color, r) {
        this.options.context.save();
        this.options.context.beginPath();
        this.options.context.moveTo(this.options.centerX, this.options.centerY);
        this.options.context.arc(xCor, yCor, r, 0, 2 * Math.PI, false);
        this.options.context.closePath();
        this.options.context.fillStyle = color;
        this.options.context.fill();
        this.options.context.restore();
    }

    PieBuilder.prototype.DrawSegment = function (i) {
        this.options.context.save();
        var radius = this.options.radiusList[i];
        var startingAngle = this.DegreesToRadians(this.SumTo(this.options.dataList, i));
        var arcSize = this.DegreesToRadians(this.options.dataList[i]);
        var endingAngle = startingAngle + arcSize;
        this.options.context.beginPath();
        if (this.options.focusPie == i) {
            this.options.context.shadowBlur = 10;
            this.options.context.shadowOffsetY = 5;
            this.options.context.shadowColor = "#999";
        }
        this.options.context.moveTo(this.options.centerX, this.options.centerY);
        this.options.context.arc(this.options.centerX, this.options.centerY, radius, startingAngle, endingAngle, false);
        this.options.context.closePath();
        this.options.context.fillStyle = this.options.colorList[i];
        this.options.context.fill();
        this.options.context.restore();
        this.DrawPercentage(i, startingAngle, endingAngle);
    }

    PieBuilder.prototype.DrawLine = function (x, y, x1, y1) {
        this.options.context.save();
        this.options.context.beginPath();
        this.options.context.moveTo(x, y);
        this.options.context.lineTo(x1, y1);
        this.options.context.stroke();
        this.options.context.restore();
    }

    PieBuilder.prototype.DrawPercentage = function (i, startingAngle, endingAngle) {
        var gap = 40;
        var additionalValueX = 0;
        var additionalValueY = 0;
        var additionalAngle = (startingAngle - endingAngle) / 2;
        var x = this.options.centerX + 50 * Math.cos(startingAngle - additionalAngle);
        var y = this.options.centerY + 50 * Math.sin(startingAngle - additionalAngle);
        var x2 = this.options.centerX + (this.options.radiusList[i] + gap) * Math.cos(startingAngle - additionalAngle);
        var y2 = this.options.centerY + (this.options.radiusList[i] + gap) * Math.sin(startingAngle - additionalAngle);
        this.DrawLine(x, y, x2, y2);
        this.DrawSamllCircle(x, y, "#000", 2);
        var smlLineDir = 40;
        var textAlign = 'left';
        var labelBox = 10;
        this.options.changeAdditional = this.options.changeAdditional + Math.abs(additionalAngle);
        if (this.options.changeAdditional > (0.5 * Math.PI) && this.options.changeAdditional < (1.5 * Math.PI)) {
            smlLineDir = -40;
            labelBox = -this.options.datathresholdDistance[i];
            textAlign = 'right';
        }
        this.options.changeAdditional = this.options.changeAdditional + Math.abs(additionalAngle);
        this.DrawLine(x2, y2, x2 + smlLineDir, y2);
        this.DrawSamllCircle(x2 + smlLineDir, y2, "#000", 2);
        this.options.context.font = this.options.fontVarient + ' ' + this.options.fontSize + "px " + this.options.fontFamily;
        this.options.context.fillStyle = this.options.labelColor;
        this.options.context.textAlign = textAlign;
        this.options.context.fillText(this.options.dataLabelList[i], x2 + smlLineDir + labelBox, y2 + (this.options.fontSize / 2));
        this.options.context.font = this.options.percentageFontVarient + ' ' + this.options.percentageFontSize + "px " + this.options.percentageFontFamily;
        this.options.context.fillStyle = this.options.percentageColor;
        this.options.context.fillText(this.options.percentage[i] + '%', x2 + smlLineDir + labelBox, y2 + (this.options.fontSize / 2) + parseInt(this.options.fontSize));
        this.options.context.restore();
    }

    PieBuilder.prototype.DegreesToRadians = function (degrees) {
        return (degrees * Math.PI) / 180;
    }
    PieBuilder.prototype.SumTo = function (a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

} ());