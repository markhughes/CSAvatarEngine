/**
 * AvatarEngine
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Mark Hughes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Lets register our elements 
document.registerElement("x-avatar", {
	prototype: Object.create(HTMLElement.prototype)
});

// Constants 
var AvatarDirection = {
	North: "n",
	East: "e",
	South: "s",
	West: "w",
	NorthEast: "ne",
	SouthEast: "se",
	SouthWest: "se",
	NorthWest: "nw"
};

var AvatarGender = { Male: "male", Female: "female" };

// Main Object 
var AvatarEngine = {
	path: "../../CSAvatarAssets/",
	topsWithoutArms: [ 2, "2" ],
	get: function(id, gender) {
		
		if(gender == 0 || gender ==null || gender == "0") {
			gender = AvatarGender.Male;	
		}
		
		var avatarElement = document.createElement('x-avatar')
		
		avatarElement.className = "v-avatar-" + id;
		avatarElement.createdAt = new Date();
		
		avatarElement.avatarID = id;
		
		avatarElement.avatarGender = gender;
		avatarElement.avatarDirection = AvatarDirection.SouthEast;
		
		avatarElement.set = function(data) {
			if(data.gender != undefined) {
				this.avatarGender = data.gender;	
			}
			
			if(data.gender != undefined) {
				this.avatarGender = data.gender;	
			}			
		}
		avatarElement.avatarAt = 1;
		avatarElement.isWalking = false;
		avatarElement.isSitting = false;
		
		avatarElement.clothes = {
			hair: 0,
			head: "1",
			body: "1",
			legs: 0,
			top: 0,
			eyes: "1",
			face: "1"
		};
		
		avatarElement.update = function() {
			this.innerHTML = "";
			
			avatarElement.avatarAt++;
			
			this.appendChild(this.generateHair());
			this.appendChild(this.generateHead());
			this.appendChild(this.generateFace());
			this.appendChild(this.generateEyes());
			this.appendChild(this.generateBody());
			this.appendChild(this.generateArmA());
			this.appendChild(this.generateArmB());
			
			if(this.generateTop() != 0 && this.generateTop() != "0") {
				this.appendChild(this.generateTop());
			}
			
			if(this.generateLegs() != 0 && this.generateLegs() != "0") {
				this.appendChild(this.generateLegs());
			}
			
			
			if(avatarElement.avatarAt == 4) {
				avatarElement.avatarAt = 1;	
			}
		};
		
		avatarElement.generateHead = function() {
			var a_body = document.createElement("x-avatar-head");
			a_body.style.position = "absolute";
			a_body.style.zIndex = "14";
			
			a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/head/"+this.avatarDirection+"/"+avatarElement.clothes.head+".png\">";

			return a_body;
		};
		
		avatarElement.generateHair = function() {
			var eHair = document.createElement("x-avatar-hair");
			eHair.style.position = "absolute";
			eHair.style.zIndex = "16";
			
			if(avatarElement.clothes.hair != 0 && avatarElement.clothes.hair != "0") {
				eHair.innerHTML = "<img src=\""+AvatarEngine.path+"assets/hair/"+avatarElement.clothes.hair+"/"+this.avatarDirection+".png\">";
			}
			
			return eHair;
		};
		
		avatarElement.generateArmA = function() {
			var a_body = document.createElement("x-avatar-arm-a");
			var s = 1;
			if(this.isWalking) {
				if(this.avatarAt > 2) {
					s = 1;
				} else {
					s = this.avatarAt;	
				}
				
				if(s == 1) { s = 2; } else { s = 1; }
			}
			a_body.style.position = "absolute";
			a_body.style.zIndex = "9";
			
			a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/shared/a/arm-"+s+".png\">";
			
			return a_body;
		};
		avatarElement.generateArmB = function() {
			var a_body = document.createElement("x-avatar-arm-b");
			var s = 1;
			if(this.isWalking) {
				if(this.avatarAt > 2) {
					s = 1;
				} else {
					s = this.avatarAt;	
				}
			}
			a_body.style.position = "absolute";
			a_body.style.zIndex = "14";
			
			a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/shared/b/arm-"+s+".png\">";

			return a_body;
		};
		
		avatarElement.generateTop = function() {
			
			if(this.clothes.top == 0 || this.clothes.top == "0") {
				return 0;
			}
			
			var eTop = document.createElement("x-avatar-top");
			eTop.style.position = "absolute";
			eTop.style.zIndex = "15";
			
			var mid = document.createElement("x-avatar-mid");
			var armA = document.createElement("x-avatar-armA");
			var armB = document.createElement("x-avatar-armB");
			
			mid.style.position = "absolute";
			mid.style.zIndex = "15";
			
			armA.style.position = "absolute";
			armA.style.zIndex = "16";
			
			armB.style.position = "absolute";
			armB.style.zIndex = "16";
			
			mid.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/top-se-stand.png\">";
			
			if(AvatarEngine.topsWithoutArms.indexOf(this.clothes.top) == -1) {
			
			console.log(this.clothes);
			armA.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/arm-a-1.png\">";
			
			armB.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/arm-b-1.png\">";
			
			}
			eTop.appendChild(mid);
			eTop.appendChild(armA);
			eTop.appendChild(armB);
			
			return eTop;
			
		};
		
		avatarElement.generateFace = function(face) {
			if(face == undefined) {
				face = this.clothes.face;
			}
			var eFace = document.createElement("x-avatar-face");
			eFace.style.position = "absolute";
			eFace.style.zIndex = "15";
			
			eFace.innerHTML = "<img src=\""+AvatarEngine.path+"assets/faces/"+face+"/"+this.avatarDirection+".png\">";

			return eFace;
		};
		
		avatarElement.generateEyes = function(eyes) {
			if(eyes == undefined) {
				eyes = this.clothes.eyes;
			}
			var eEye = document.createElement("x-avatar-eyes");
			eEye.style.position = "absolute";
			eEye.style.zIndex = "15";
			
			eEye.innerHTML = "<img src=\""+AvatarEngine.path+"assets/eyes/"+eyes+"/"+this.avatarDirection+".png\">";

			return eEye;
		};
		
		avatarElement.generateBody = function() {
			var a_body = document.createElement("x-avatar-body");
			a_body.style.position = "absolute";
			a_body.style.zIndex = "10";
			
			if(this.isSitting) {
				a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-sit.png\">";

			} else {
				if(this.isWalking) {
					a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-walk-"+this.avatarAt+".png\">";
				} else {
					a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-stand.png\">";

				}

			}
			return a_body;
		}
		
		avatarElement.generateLegs = function() {
			if(avatarElement.clothes.legs == 0 || avatarElement.clothes.legs == "0") {
				return 0;
			}
			var a_body = document.createElement("x-avatar-legs");
			a_body.style.position = "absolute";
			a_body.style.zIndex = "12";
			if(this.isSitting) {
				a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-sit.png\">";
			} else {
				if(this.isWalking) {
					a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-walk-"+this.avatarAt+".png\">";
				} else {
					a_body.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-stand.png\">";
				}				
			}
			
			return a_body;
		}
		setInterval(function() {
			avatarElement.update();
		}, 150);
		return avatarElement;
		
	}
};
