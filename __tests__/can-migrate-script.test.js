const { transformer } = require('../src/can-migrate-script')

const settings = {
  path: 'stuff.stache'
}

describe('transformer', () => {
  it('should work with some very simple stache content', () => {
    const source = `<advanced-search-filter-state
            {model-name}="{modelName}">
          </advanced-search-filter-state>`
    const output = transformer({source, ...settings})
    expect(output).toBe(`<advanced-search-filter-state
            modelName:from="modelName">
          </advanced-search-filter-state>`)
  })
})

