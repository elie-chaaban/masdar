import React from 'react';
import {mount} from 'enzyme';
import Loader from '../';

describe('Loader', () => {
  it('sould have default props', () => {
    const dom = mount(
      <Loader>
        <p>loading...</p>
      </Loader>
    );
    expect(dom.find('.lds-ellipsis').childAt(0).prop('style')).toEqual({backgroundColor: '#fff'});
    expect(dom.find('p')).toHaveLength(1);
    expect(dom.find('Row').prop('style')).toEqual({color: '#fff', margin: 20, height: '100%', minHeight: '100%'});
    expect(dom).toMatchSnapshot();
  });
  it('sould have default props', () => {
    const dom = mount(
      <Loader color="red" margin={0} height="100px">
        <p>loading...</p>
      </Loader>
    );
    expect(dom.find('.lds-ellipsis').childAt(0).prop('style')).toEqual({backgroundColor: 'red'});
    expect(dom.find('p')).toHaveLength(1);
    expect(dom.find('Row').prop('style')).toEqual({color: 'red', margin: 0, height: '100px', minHeight: '100px'});
  });
});
