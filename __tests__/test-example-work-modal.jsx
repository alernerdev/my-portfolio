import React from 'react';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExampleWorkModal from '../js/example-work-modal';

const myExample = {
	title: "Work Example",
	href: "https://example.com",
	desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem iure totam sequi accusantium voluptates, libero tempore aspernatur eligendi quas sapiente consectetur eos itaque voluptatum vitae id non fugit neque. Vel?",
	image: {
		desc: "example screen shot of a project involving",
		src: "images/example1.png",
		comment: ""
	}
};

// enzyme call
configure({ adapter: new Adapter() });

describe("ExampleWorkModal component", ()=> {
	let component = shallow(<ExampleWorkModal example={myExample} open={false}/>);

	let componentOpen = shallow(<ExampleWorkModal example={myExample} open={true}/>);

	let anchors = component.find("a");

	it("should contain a single 'a' element", ()=> {
		expect(anchors.length).toEqual(1);
	});

	it("should link to pur project", ()=> {
		expect(anchors.getElement(0).props.href).toEqual(myExample.href);
	});

	it("should have modal class set correctly", ()=> {
		expect(component.find(".background--skyBlue").hasClass("modal--closed")).toBe(true);
		expect(componentOpen.find(".background--skyBlue").hasClass("modal--open")).toBe(true);
	});
});
