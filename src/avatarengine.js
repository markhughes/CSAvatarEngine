/**
 * AvatarEngine
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Mark Hughes <mark@markeh.me>
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
	// Path to CSAvatarAssets
	path: "../../CSAvatarAssets/",
	
	// These are tops without any arm graphics
	topsWithoutArms: [ 2, 16, 17 ],
	
	// Returns an x-avatar element
	get: function(id, gender) {
		
		if(gender == 0 || gender == null || gender == undefined || gender == "0") {
			gender = AvatarGender.Male;	
		}
		
		// Crete element
		var avatarElement = document.createElement("x-avatar");
		
		// Set default information
		avatarElement.className = "v-avatar-" + id;
		avatarElement.createdAt = new Date();
		avatarElement.avatarID = id;
		avatarElement.avatarGender = gender;
		avatarElement.avatarDirection = AvatarDirection.SouthEast;
		avatarElement.avatarAt = 1;
		avatarElement.isWalking = false;
		avatarElement.isSitting = false;
		
		// Set default clothes
		avatarElement.clothes = {
			hair:	0,
			head:	1,
			body:	1,
			legs:	0,
			top:	0,
			eyes:	1,
			face:	1,
		};
		
		/**
		 * update()
		 * Updates the avatar element with whatever we need
		 */
		avatarElement.update = function() {
			this.innerHTML = "";
			
			avatarElement.avatarAt++;
			
			// Append our required elements to the element
			this.appendChild(this.generateHair());
			this.appendChild(this.generateHead());
			this.appendChild(this.generateFace());
			this.appendChild(this.generateEyes());
			this.appendChild(this.generateBody());
			this.appendChild(this.generateArmA());
			this.appendChild(this.generateArmB());
			
			// Only generate top if we have one on
			if(this.generateTop() != 0 && this.generateTop() != "0") {
				this.appendChild(this.generateTop());
			}
			
			// Only generate legs if we have one on
			if(this.generateLegs() != 0 && this.generateLegs() != "0") {
				this.appendChild(this.generateLegs());
			}
			
			// All graphics work through 4 different stages, so when we're at
			// 4 we should revert to 1
			if(avatarElement.avatarAt == 4) {
				avatarElement.avatarAt = 1;	
			}
		};
		
		/**
		 * generateHead()
		 * Returns the x-avatar-head element
		 */
		avatarElement.generateHead = function() {
			var eHead = document.createElement("x-avatar-head");
			eHead.style.position = "absolute";
			eHead.style.zIndex = "15";
			
			eHead.innerHTML = "<img src=\""+AvatarEngine.path+"assets/head/"+this.avatarDirection+"/"+avatarElement.clothes.head+".png\">";

			return(eHead);
		};
		
		/**
		 * generateHair()
		 * Returns the x-avatar-hair element
		 */
		avatarElement.generateHair = function() {
			var eHair = document.createElement("x-avatar-hair");
			eHair.style.position = "absolute";
			eHair.style.zIndex = "16";
			
			// only add contents if they have hair 
			if(avatarElement.clothes.hair != 0 && avatarElement.clothes.hair != "0") {
				eHair.innerHTML = "<img src=\""+AvatarEngine.path+"assets/hair/"+avatarElement.clothes.hair+"/"+this.avatarDirection+".png\">";
			}
			
			return eHair;
		};
		
		/**
		 * generateArmA()
		 * Returns generateArmA x-avatar-arm-a element
		 */
		avatarElement.generateArmA = function() {
			var eArmA = document.createElement("x-avatar-arm-a");
			var s = 1;
			
			// if we're walking, lets update the step
			if(this.isWalking) {
				if(this.avatarAt > 2) {
					s = 1;
				} else {
					s = this.avatarAt;	
				}
				
				if(s == 1) { s = 2; } else { s = 1; }
			}
			
			eArmA.style.position = "absolute";
			eArmA.style.zIndex = "9";
			
			eArmA.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/shared/a/arm-"+s+".png\">";
			
			return eArmA;
		};
		
		/**
		 * generateArmB()
		 * Returns generateArmA x-avatar-arm-a element
		 */
		avatarElement.generateArmB = function() {
			var eArmB = document.createElement("x-avatar-arm-b");
			var s = 1;
			
			// if we're walking, lets update the step (like in ArmA)
			if(this.isWalking) {
				if(this.avatarAt > 2) {
					s = 1;
				} else {
					s = this.avatarAt;	
				}
			}
			eArmB.style.position = "absolute";
			eArmB.style.zIndex = "14";
			
			eArmB.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/shared/b/arm-"+s+".png\">";

			return eArmB;
		};
		
		/**
		 * generateTop()
		 * Returns generateArmA x-avatar-top element, with the top-armA and top-armB elements
		 */
		avatarElement.generateTop = function() {
			
			if(this.clothes.top == 0 || this.clothes.top == "0") {
				return 0;
			}
			
			var eTop = document.createElement("x-avatar-top");
			eTop.style.position = "absolute";
			eTop.style.zIndex = "15";
			
			var mid = document.createElement("x-avatar-mid");
			var armA = document.createElement("x-avatar-top-armA");
			var armB = document.createElement("x-avatar-top-armB");
			
			mid.style.position = "absolute";
			mid.style.zIndex = "16";
			
			armA.style.position = "absolute";
			armA.style.zIndex = "15";
			
			armB.style.position = "absolute";
			armB.style.zIndex = "15";
			
			mid.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/top-se-stand.png\">";
			
			// If it has arms, add them
			if(AvatarEngine.topsWithoutArms.indexOf(this.clothes.top) == -1) {
				armA.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/arm-a-1.png\">";
				armB.innerHTML = "<img src=\""+AvatarEngine.path+"assets/top/"+this.clothes.top+"/arm-b-1.png\">";
			}
			
			// Put it all together and send it back! 
			eTop.appendChild(mid);
			eTop.appendChild(armA);
			eTop.appendChild(armB);
			
			return eTop;
			
		};
		
		/**
		 * generateFace()
		 * Returns x-avatar-face 
		 */
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
		
		/**
		 * generateEyes()
		 * Returns x-avatar-eyes 
		 */
		avatarElement.generateEyes = function(eyes) {
			if(eyes == undefined) {
				eyes = this.clothes.eyes;
			}
			
			var eEyes = document.createElement("x-avatar-eyes");
			eEyes.style.position = "absolute";
			eEyes.style.zIndex = "15";
			
			eEyes.innerHTML = "<img src=\""+AvatarEngine.path+"assets/eyes/"+eyes+"/"+this.avatarDirection+".png\">";

			return eEyes;
		};
		
		/**
		 * generateBody()
		 * Returns x-avatar-body 
		 */
		avatarElement.generateBody = function() {
			var eBody = document.createElement("x-avatar-body");
			eBody.style.position = "absolute";
			eBody.style.zIndex = "10";
			
			// If they're sitting, we'll show the sit asset
			if(this.isSitting) {
				eBody.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-sit.png\">";
			} else {
				if(this.isWalking) {
					// if they're walking, we'll show the walking assets (in steps)
					eBody.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-walk-"+this.avatarAt+".png\">";
				} else {
					// not walking, so we just show the stand asset 
					eBody.innerHTML = "<img src=\""+AvatarEngine.path+"assets/body/"+this.avatarGender+"/body-se-stand.png\">";
				}
			}
			
			return eBody;
		}
		
		/**
		 * generateLegs()
		 * Returns x-avatar-legs 
		 */
		avatarElement.generateLegs = function() {
			if(avatarElement.clothes.legs == 0 || avatarElement.clothes.legs == "0") {
				return 0;
			}
			
			// same deal with body, ill re-document it later
			
			var eLegs = document.createElement("x-avatar-legs");
			eLegs.style.position = "absolute";
			eLegs.style.zIndex = "12";
			if(this.isSitting) {
				eLegs.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-sit.png\">";
			} else {
				if(this.isWalking) {
					eLegs.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-walk-"+this.avatarAt+".png\">";
				} else {
					eLegs.innerHTML = "<img src=\""+AvatarEngine.path+"assets/legs/"+avatarElement.clothes.legs+"/legs-se-stand.png\">";
				}				
			}
			
			return eLegs;
		}
		
		// We call update every 150ms, this is only used for arm/leg movemnets at the moment
		// but in the future it will also be used for eye blinks.
		setInterval(function() {
			avatarElement.update();
		}, 150);
		
		// Return the avatar element
		return avatarElement;
		
	}
};
