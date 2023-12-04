import { describe, it, expect } from '@jest/globals';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

describe('CSSSpatialStyleDeclaration', () => {
  it.todo('has only valid properties implemented');

  it('has all functions', () => {
    const style = new CSSSpatialStyleDeclaration();
    expect(typeof style.item).toEqual('function');
    expect(typeof style.getPropertyValue).toEqual('function');
    expect(typeof style.setProperty).toEqual('function');
    expect(typeof style.getPropertyPriority).toEqual('function');
    expect(typeof style.removeProperty).toEqual('function');

    // TODO - deprecated according to MDN and not implemented at all, can we remove?
    expect(typeof style.getPropertyCSSValue).toEqual('function');
  });

  it('has special properties', () => {
    const style = new CSSSpatialStyleDeclaration();
    expect(style).toHaveProperty('cssText');
    expect(style).toHaveProperty('length');
    expect(style).toHaveProperty('parentRule');
  });

  it.todo('from style string');

  it('from properties', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.diffuseColor = 'blue';
    expect(style.length).toEqual(1);
    expect(style[0]).toEqual('diffuse-color');
    expect(style.cssText).toEqual('diffuse-color: blue;');
    expect(style.item(0)).toEqual('diffuse-color');
    expect(style.diffuseColor).toEqual('blue');
    style.position = '1';
    expect(style.length).toEqual(2);
    expect(style[0]).toEqual('diffuse-color');
    expect(style[1]).toEqual('position');
    expect(style.cssText).toEqual('diffuse-color: blue; position: 1;');
    expect(style.position).toEqual('1');
    style.removeProperty('diffuse-color');
    expect(style[0]).toEqual('position');
  });

  it.todo('shorthand properties');
  it.todo('width and height properties and null and empty strings');
  it.todo('implicit properties');

  it('colors', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.diffuseColor = 'rgba(0,0,0,0)';
    expect(style.diffuseColor).toEqual('rgba(0, 0, 0, 0)');
    style.diffuseColor = 'rgba(5%, 10%, 20%, 0.4)';
    expect(style.diffuseColor).toEqual('rgba(12, 25, 51, 0.4)');
    style.diffuseColor = 'rgb(33%, 34%, 33%)';
    expect(style.diffuseColor).toEqual('rgb(84, 86, 84)');
    style.diffuseColor = 'rgba(300, 200, 100, 1.5)';
    expect(style.diffuseColor).toEqual('rgb(255, 200, 100)');
    style.diffuseColor = 'hsla(0, 1%, 2%, 0.5)';
    expect(style.diffuseColor).toEqual('rgba(5, 5, 5, 0.5)');
    style.diffuseColor = 'hsl(0, 1%, 2%)';
    expect(style.diffuseColor).toEqual('rgb(5, 5, 5)');
    style.diffuseColor = 'rebeccapurple';
    expect(style.diffuseColor).toEqual('rebeccapurple');
    style.diffuseColor = 'transparent';
    expect(style.diffuseColor).toEqual('transparent');
    style.diffuseColor = 'currentcolor';
    expect(style.diffuseColor).toEqual('currentcolor');
    style.diffuseColor = '#ffffffff';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 1)');
    style.diffuseColor = '#fffa';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 0.667)');
    style.diffuseColor = '#ffffff66';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 0.4)');
  });

  it.todo('short hand properties with embedded spaces');
  it.todo('setting shorthand properties to an empty string should clear all dependent properties');

  it('onchange callback should be called when the csstext changes', () => {
    const style = new CSSSpatialStyleDeclaration(function (cssText) {
      expect(cssText).toEqual('diffuse-color: red;');
    });
    style.setProperty('diffuse-color', 'red');
    expect(style.length).toEqual(1);
    expect(style.diffuseColor).toEqual('red');
  });

  it.todo('setting improper css to csstext should not throw');
  it.todo('url parsing works with quotes');
  it.todo('setting ex units to a padding or margin works');

  it('camelcase properties are not assigned with `.setproperty()`', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('diffuseColor', 'red');
    expect(style.cssText).toEqual('');
  });

  it('casing is ignored in `.setproperty()`', () => {
    var style = new CSSSpatialStyleDeclaration();
    style.setProperty('DiFfUsE-CoLoR', 'red');
    expect(style.diffuseColor).toEqual('red');
    expect(style.getPropertyValue('diffuse-color')).toEqual('red');
  });

  it.skip('getPropertyValue for custom properties in cssText', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.cssText = '--foo: red';
    expect(style.getPropertyValue('--foo')).toEqual('red');
  });

  it('getPropertyValue for custom properties with setProperty', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('--bar', 'blue');
    expect(style.getPropertyValue('--bar')).toEqual('blue');
  });

  it('getPropertyValue for custom properties with object setter', () => {
    const style = new CSSSpatialStyleDeclaration();
    style['--baz'] = 'yellow';
    expect(style.getPropertyValue('--baz')).toEqual('');
  });

  it.skip('custom properties are case-sensitive', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.cssText = '--fOo: purple';
    expect(style.getPropertyValue('--foo')).toEqual('');
    expect(style.getPropertyValue('--fOo')).toEqual('purple');
  });

  it.skip('supports calc', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('width', 'calc(100% - 100px)');
    expect(style.getPropertyValue('width')).toEqual('calc(100% - 100px)');
  });
});
