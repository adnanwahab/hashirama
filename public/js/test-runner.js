

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log(d3)
setTimeout(() => {
    const container = d3.select('body').node()
    //console.log(container.node())
// container.id = "test-runner"
// document.body.appendChild(container)  

const tests = [
    {
        name: "test1",
        description: "test1 description",
        result: () => {
            return true
        }
    },
    {
      name: "test2",
      description: "test1 description",
      result: () => {
          return false
      },

  },
  {
    name: "test3",
    description: "test1 description",
    result: async () => {
        return await d3.json("/llama-backend/0", {
            method: 'POST',
            body: JSON.stringify({
                message: "hello"
            })
        })
    },
  },

  // {
  //   name: "test4",
  //   description: "test4 description",
  //   result: () => {
  //       return d3.json("https://localhost:8002/llama-backend/0").then(res => res.json()).then(data => data.length > 0)
  //   },
  // },

]
console.log(tests)

tests.forEach(async test => {
    console.log(test.name)
    const result = await test.result()
    container.innerHTML += `<div>${test.name}: ${result}</div>`
    
    
    console.log(container)
})}, 1000)
//tape curl os automation