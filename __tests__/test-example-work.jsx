import React from 'react';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExampleWork from '../js/example-work';
import { ExampleWorkBubble } from '../js/example-work';

const myWork = [
	{
		title: "Work Example",
		image: {
			desc: "example screen shot of a project involving",
			src: "images/example1.png",
			comment: ""
		}
	},
	{
		title: "Portfolio Boilerplate",
		image: {
			desc: "A serverless Portfolio",
			src: "images/example2.png",
			comment: ""
		}
	},
];

// enzyme call
configure({ adapter: new Adapter() });

describe("ExampleWork component", ()=> {
	let component = shallow(<ExampleWork work={myWork}/>);

	it("should be a section element", ()=> {
		expect(component.type()).toEqual('section');
	});

	it("should contain as many children as there are work examples", ()=> {
		expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
	});
});

describe("ExampleWorkBubble component", ()=> {
	let component = shallow(<ExampleWorkBubble example={myWork[1]}/>);
	let images = component.find("img");

	it("should contain a single img element", ()=> {
		expect(images.length).toEqual(1);
	});
	it("should have img src set correctly", ()=> {
		expect(images.getElement(0).props.src).toEqual(myWork[1].image.src);
	});
});
