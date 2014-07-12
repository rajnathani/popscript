

var assert = require("assert");
var should = require("should");
var compiler = require("../src/compiler/compiler.js");
var convert = require("../src/compiler/convert.js");


describe("Convert", function(){


  describe("#convert.bool", function(){
    it("should pass check of boolean true", function(){
      convert.bool(true).should.equal(true);
    });
    it("should pass check of boolean false", function(){
      convert.bool(false).should.equal(false);
    });
    it("should pass 0 is false", function(){
      convert.bool(0).should.equal(false);
    });
    it("should pass 1 is true", function(){
      convert.bool(1).should.equal(true);
    });
    it("should pass number greater than 0 is true", function(){
      convert.bool(3).should.equal(true);
    });
    it("should pass single character lower case y is true", function(){
      convert.bool("y").should.equal(true);
    });
    it("should pass single character upper case Y is true", function(){
      convert.bool("Y").should.equal(true);
    });
    it("should pass single character lower case n is false", function(){
      convert.bool("n").should.equal(false);
    });
    it("should pass single character lower case N is false", function(){
      convert.bool("N").should.equal(false);
    });
    it("should pass multi letter string starting with y/Y is true", function(){
      convert.bool("yeSS").should.equal(true);
    });
    it("should pass multi letter string starting with n/Y is false", function(){
      convert.bool("NAWW").should.equal(false);
    });

    it("should throw error on string not beginning with y or n", function(){
      // TODO: somebody get should.throw to work!
      try {
        convert.bool('maybe')
        assert(false);
      } catch(err){
        assert(true);
      }
    });
  });

  describe("#convert.boxPosition", function(){
    var compiled, prop, scrolled_prop,scroll_pop;
    prop = "position_x";
    scrolled_prop = prop + "_scrolled";
    scroll_pop = prop + "_scroll";
    compiled = {};

    it("should pass auto", function(){
      convert.boxPosition.call([prop, compiled], "auto").should.eql(["auto", false, false]);
    });
    it("should pass auto with scroll", function(){
      convert.boxPosition.call([prop, compiled], "auto+scrolled").should.eql(["auto", false, false]) && compiled[scrolled_prop].should.be.True;
    });
    it("should pass left", function(){
      convert.boxPosition.call([prop, compiled], "left").should.eql([0, true, false]);
    });
    it("should pass top", function(){
      convert.boxPosition.call([prop, compiled], "top").should.eql([0, true, false]);
    });
    it("should pass right", function(){
      convert.boxPosition.call([prop, compiled], "right").should.eql([0, false, false]);
    });
    it("should pass bottom", function(){
      convert.boxPosition.call([prop, compiled], "bottom").should.eql([0, false, false]);
    });
    it("should pass number", function(){
      convert.boxPosition.call([prop, compiled], 16).should.eql([16, true, false]);
    });
    it("should pass string number + scroll", function(){
      convert.boxPosition.call([prop, compiled], "20 +scroll").should.eql([20, true, false]) && compiled["position_x_scroll"].should.be.True;
    });
    it("should pass percent", function(){
      convert.boxPosition.call([prop, compiled], "10%").should.eql([0.1, true, true]);
    });
    it("should pass bottom/right", function(){
      convert.boxPosition.call([prop, compiled], "!9").should.eql([9, false, false]);
    });
  });

  describe("#convert.positionCheck", function(){


    it("should pass empty", function(){
      convert.positionCheck("").should.eql([[],[]]);
    });
    it("should pass single timeout", function(){
      convert.positionCheck("20").should.eql([[20],[]]);
    });
    it("should pass single interval", function(){
      convert.positionCheck("50*").should.eql([[],[50]]);
    });
    it("should pass single timeout single interval", function(){
      convert.positionCheck(" 50*,20 ").should.eql([[20],[50]]);
    });
    it("should pass multi timeout multi interval", function(){
      convert.positionCheck(" 50,10*, 49, 3*, 145* ").should.eql([[50, 49],[10, 3, 145]]);
    });
  });

  describe("#convert.z", function(){

    var base_z = 1000;
    GLOBAL.PS = {flags:{Z:base_z}};

    it("should pass number without operator", function(){
      convert.z(5)().should.equal(5);
    });
    it("should pass string without operator", function(){
      convert.z(" 5  ")().should.equal(5);
    });
    it("should pass unary positive string", function(){
      convert.z("+2")().should.equal(base_z+2);
    });
    it("should pass unary negative string", function(){
      convert.z(" -1")().should.equal(base_z-1);
    });

  });


  describe("#convert.ani", function(){

    var compiled = {};

    it("should pass single non duration animation", function(){
      convert.ani.call(["animation_in_box", compiled], "fade-in").should.eql(["fade-in", "$g", undefined]) &&
      compiled.should.eql({animation_in_true_duration: {global: true, len: 0}})
    });
    it("should pass multiple non duration animation", function(){
      convert.ani.call(["animation_in_cover", compiled], "fade-in, fade-out,slide-in").should.eql(["fade-in, fade-out,slide-in", "$g,$g,$g", undefined]) &&
      compiled.should.eql({animation_in_true_duration: {global: true, len: 0}})
    });
    it("should pass single duration animation", function(){
      convert.ani.call(["animation_out_box", compiled], "fade-in 2s").should.eql(["fade-in 2s", "2000ms", 2000]) &&
      compiled.should.eql({animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: undefined, len: 2000}})
    });
    it("should pass multiple duration animation", function(){
      convert.ani.call(["animation_out_cover", compiled], "fade-in 2s, fade-out,slide-in 10000ms").should.eql(["fade-in 2s, fade-out,slide-in 10000ms", "2000ms,$g,10000ms", 10000]) &&
      compiled.should.eql({animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: true, len: 10000}})
    });
  });



  describe("#convert.hideOrDestroy", function(){
    it("should pass hide", function(){
      convert.hideOrDestroy("hide").should.equal("hide");
    });
    it("should pass destroy", function(){
      convert.hideOrDestroy("destroy").should.equal("destroy");
    });
    it("should throw error on other", function(){
      try {
        convert.hideOrDestroy("shut");
        assert(false);
      } catch(err) {
        assert(true);
      }
    });

  });



  describe("Compiler", function(){
    describe("#compileScope", function(){
      var pop_class_script, compiled_pop_classes_script;
      var animations_scope = {box: "xyz"};
      var classes_scope = {box: "abc"};
      var multi_animations_scope = {cover: "asd", box: "pqr"};
      pop_class_script = {mybox: {ANIMATION: {IN: animations_scope,
        OUT: multi_animations_scope},
        STYLE_CLASS: {box: classes_scope}}};
        compiled_pop_classes_script = {click_me_out: false}; // The compiled popscript has some preregistered properties.



        it("should pass basic scope property registration", function(){
          compiler.compileScope(["ANIMATION", "IN"], animations_scope, compiled_pop_classes_script, pop_class_script);
          compiled_pop_classes_script.should.eql({click_me_out: false, animation_in_box: convert.ani.call(["animation_in_box", {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}});
        })
        it("should pass scope registration after existing scope registration", function(){
          compiler.compileScope(["STYLE_CLASS"], classes_scope, compiled_pop_classes_script, pop_class_script);
          compiled_pop_classes_script.should.eql({click_me_out: false, animation_in_box: convert.ani.call(["animation_in_box", {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}, style_class_box: classes_scope.box});
        })
        it("should pass multi-property scope update", function(){
          compiler.compileScope(["ANIMATION", "OUT"], multi_animations_scope, compiled_pop_classes_script, pop_class_script);
          compiled_pop_classes_script.should.eql({click_me_out: false, animation_in_box: convert.ani.call(["animation_in_box", {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: true, len: 0}, animation_out_cover: convert.ani.call(["animation_out_cover", {}], multi_animations_scope.cover), animation_out_box: convert.ani.call(["animation_out_box", {}], multi_animations_scope.box), style_class_box: classes_scope.box});
        })

      })
    })
    describe("#compile", function(){
      var compiled, override_compiled;
      override_compiled = {};
      it("should pass single property (scope-less) compilation", function(){
        compiled = {};
        compiler.compile(compiled, {basic: {
          cross: "yes"
        }})
        compiled.should.eql({basic: {cross: true}})
      });

      it("should pass multi-property-multi-class (scope-less) compilation", function(){
        compiled = {};
        compiler.compile(compiled, {basic: {
          cover: "no",
          esc: "yes"
        },
        second: {
          "blur": "noooo"
        }})
        compiled.should.eql({
          basic: {cover: false, esc: true},
          second: {blur: false}
        })
      });

      it("should pass multi-property-multi-class (scope-less) compilation", function(){
        compiler.compile(override_compiled, {
          basic: {
            cross_content: "x",
            STYLE_CLASS: {
              box: "lol"
            }
          },
          second: {
            POSITION: {"x": "10"}
          },
          third: {
            ANIMATION: {
              OUT: {
                duration: 500
              }
            }
          }
        });
        override_compiled.should.eql({
          basic: {cross_content: "x", style_class_box: "lol"},
          second: {position_x: convert.boxPosition.call(["position_x", {}], "10"), position_x_scrolled: false, position_x_scroll: false},
          third: {animation_out_duration: 500}
        })

      });

      it("should pass compilation over existing compilation: addition of a new class, modification of an existing property, addition of a new property", function(){
        compiler.compile(override_compiled,{
          basic: {
            style_class_box:"lmao", // modified property
            style_class_cover:"rofl" // added property
          },
          newest: {               // new class
            out:"hide"
          }
        });
        override_compiled.should.eql({
          basic: {cross_content: "x", style_class_box: "lmao", style_class_cover:"rofl"},
          second: {position_x: convert.boxPosition.call(["position_x", {}], "10"), position_x_scrolled: false, position_x_scroll: false},
          third: {animation_out_duration: 500},
          newest:{out:"hide"}
        })
      });

    });
  });
