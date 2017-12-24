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

	it("should be a span element", ()=> {
		expect(component.type()).toEqual('span');
	});

	it("should contain as many children as there are work examples", ()=> {
		expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
	});

	it("should allow modal open and close", ()=> {
		component.instance().openModal();
		expect(component.instance().state.modalOpen).toBe(true);
		component.instance().closeModal();
		expect(component.instance().state.modalOpen).toBe(false);
	});
});

describe("ExampleWorkBubble component", ()=> {
	let mockOpenModalFn = jest.fn();

	let component = shallow(<ExampleWorkBubble
		example={myWork[1]} openModal={mockOpenModalFn}/>);

	let images = component.find("img");

	it("should contain a single img element", ()=> {
		expect(images.length).toEqual(1);
	});
	it("should have img src set correctly", ()=> {
		expect(images.getElement(0).props.src).toEqual(myWork[1].image.src);
	});
	it("should call modalOpen handler when clicked", ()=> {
		component.find(".section__exampleWrapper").simulate('click');
		expect(mockOpenModalFn).toHaveBeenCalled();
	});
});
