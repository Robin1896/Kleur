import React from 'react';
import '../styles/main.scss';
// import fire from './fire';

const vision = require('react-cloud-vision-api');
vision.init({auth: 'AIzaSyAdJBBzi66kjNNwvPjCKcWBHpnR68IbIj8'});

class Color extends React.Component {

    constructor(props) {
        super(props);
        this.dimensions = React.createRef()
        this.state = {
            object: [],
            colors: [],
        };
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (() => {
                resolve(fileReader.result);
            });

            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({
            base64: base64,
            imageProps: file
        });
        this.apiRequest();
    }

    apiRequest() {
        const req = new vision.Request({
            image: new vision.Image({
                base64: this.state.base64,
            }),
            features: [new vision.Feature('IMAGE_PROPERTIES', 10),]
        })

        vision.annotate(req)
            .then((res) => {
                var object = res.responses[0].imagePropertiesAnnotation.dominantColors.colors;
                console.log(object)
                this.setState({
                    colors: object
                })
            }, (e) => {
                alert("foutje")
            });

    }

    render() {
        var rgbToHex = function (rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        };
        var fullColorHex = function (r, g, b) {
            var red = rgbToHex(r);
            var green = rgbToHex(g);
            var blue = rgbToHex(b);
            return red + green + blue;
        };

        var rgbToHSL = function (rgb) {
            rgb = rgb.replace(/^\s*#|\s*$/g, '');
            if(rgb.length === 3){
                rgb = rgb.replace(/(.)/g, '$1$1');
            }
            var r = parseInt(rgb.substr(0, 2), 16) / 255,
                g = parseInt(rgb.substr(2, 2), 16) / 255,
                b = parseInt(rgb.substr(4, 2), 16) / 255,
                cMax = Math.max(r, g, b),
                cMin = Math.min(r, g, b),
                delta = cMax - cMin,
                l = (cMax + cMin) / 2,
                h = 0,
                s = 0;
            if (delta === 0) {
                h = 0;
            }
            else if (cMax === r) {
                h = 60 * (((g - b) / delta) % 6);
            }
            else if (cMax === g) {
                h = 60 * (((b - r) / delta) + 2);
            }
            else {
                h = 60 * (((r - g) / delta) + 4);
            }
        
            if (delta === 0) {
                s = 0;
            }
            else {
                s = (delta/(1-Math.abs(2*l - 1)))
            }
        
            return {
                h: h,
                s: s,
                l: l
            }
        }

       var changeHue = function (rgb, degree) {
            var hsl = rgbToHSL(rgb);
            hsl.h += degree;
            if (hsl.h > 360) {
                hsl.h -= 360;
            }
            else if (hsl.h < 0) {
                hsl.h += 360;
            }
            return hslToRGB(hsl);
        }

        var hslToRGB = function (hsl) {
            var h = hsl.h,
                s = hsl.s,
                l = hsl.l,
                c = (1 - Math.abs(2*l - 1)) * s,
                x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
                m = l - c/ 2,
                r, g, b;
        
            if (h < 60) {
                r = c;
                g = x;
                b = 0;
            }
            else if (h < 120) {
                r = x;
                g = c;
                b = 0;
            }
            else if (h < 180) {
                r = 0;
                g = c;
                b = x;
            }
            else if (h < 240) {
                r = 0;
                g = x;
                b = c;
            }
            else if (h < 300) {
                r = x;
                g = 0;
                b = c;
            }
            else {
                r = c;
                g = 0;
                b = x;
            }
        
            r = normalize_rgb_value(r, m);
            g = normalize_rgb_value(g, m);
            b = normalize_rgb_value(b, m);
        
            return rgbToHexCode(r,g,b);
        }

        var normalize_rgb_value = function (color, m) {
            color = Math.floor((color + m) * 255);
            if (color < 0) {
                color = 0;
            }
            return color;
        }
        
        var rgbToHexCode = function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        
        var getComplementaryColor = (color = '') => {
            const colorPart = color.slice(1);
            const ind = parseInt(colorPart, 16);
            let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
            while (iter.length < colorPart.length) {
                iter = '0' + iter;
            };
            return '#' + iter;
        };

        const colors = this.state.colors?.map((a) =>
            <div>
                <div key = {a}>
                    #1 Dominant color : {"# "+fullColorHex(a.color.red,a.color.green,a.color.blue)} <br></br> score : {a.score*100} 
                </div> 
                <div style = {{backgroundColor: "#" + fullColorHex(a.color.red, a.color.green, a.color.blue)}}></div> 
                <div style = {{backgroundColor: "#" + fullColorHex(a.color.red, a.color.green, a.color.blue)}}> {"#" + fullColorHex(a.color.red, a.color.green, a.color.blue)} </div> 
                <div style = {{backgroundColor: getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue))}}>Complementary color: {getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue))} </div>
                <div style = {{backgroundColor: changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), 30)}}>Analogue color 1: {changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), 30)} </div>
                <div style = {{backgroundColor: changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), 0)}}>Analogue color 2: {changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), 0)} </div>
                <div style = {{backgroundColor: changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), -30)}}>Analogue color 3: {changeHue(getComplementaryColor("#" + fullColorHex(a.color.red, a.color.green, a.color.blue)), -30)} </div>
                <br></br>
            </div>
        );

        return ( 
            <div className = "color" >
                <div className = "color__image" >
                    <div className = "color__image__gridoverlay__item" ></div>
                    <img ref = {this.dimensions} src = {this.state.base64} alt="afbeelding"/> 
                </div> 
            <input className = "filetest" type = "file" onChange = {(e) => {this.uploadImage(e);}}/> 
            {colors}
            </div>
        )
    };
};

export default Color;