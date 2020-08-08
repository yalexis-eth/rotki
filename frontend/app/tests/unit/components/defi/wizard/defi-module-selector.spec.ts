import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import DefiModuleSelector from '@/components/defi/wizard/DefiModuleSelector.vue';
import { api } from '@/services/rotkehlchen-api';
import store from '@/store/store';
import { GeneralSettings } from '@/typing/types';

jest.mock('@/services/rotkehlchen-api');

Vue.use(Vuetify);

describe('DefiModuleSelector.vue', () => {
  let wrapper: Wrapper<DefiModuleSelector>;

  function createWrapper() {
    const vuetify = new Vuetify();
    return mount(DefiModuleSelector, {
      store,
      vuetify,
      stubs: ['v-tooltip']
    });
  }

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true');
    const settings: GeneralSettings = {
      ...store.state.session!.generalSettings,
      activeModules: ['aave']
    };
    store.commit('session/generalSettings', settings);

    wrapper = createWrapper();
  });

  test('displays active modules', async () => {
    expect(wrapper.find('#defi-module-aave').exists()).toBe(true);
  });

  test('removes active modules on click', async () => {
    expect.assertions(2);
    api.setSettings = jest.fn().mockResolvedValue({ active_modules: [] });
    wrapper.find('#defi-module-aave').find('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#defi-module-aave').exists()).toBe(false);
    expect(store.state.session!.generalSettings.activeModules).toEqual([]);
  });
});