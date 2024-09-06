import React from 'react';
import {shallow} from 'enzyme';
import LoaderFull from '../';

describe('Full Page Loader', () => {
  it('should have default props as white', () => {
    const dom = shallow(<LoaderFull />);
    expect(dom.find('.lds-ellipsis').childAt(0).prop('style')).toEqual({backgroundColor: 'white'});
    expect(dom).toMatchSnapshot();
  });
  it('should have passed props', () => {
    const dom = shallow(<LoaderFull color="red" />);
    expect(dom.find('.lds-ellipsis').childAt(0).prop('style')).toEqual({backgroundColor: 'red'});
  });
});
