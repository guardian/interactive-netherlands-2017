import mainTemplate from './src/templates/main.html!text'
import xr from 'xr'
import config from './../config.json'
import Mustache from 'mustache'
//import swig from 'swig'
import chambertemplate from './src/templates/chamber.html'

function baseversion() {
    return mainTemplate;
}

export async function render() {
    return baseversion();
}
