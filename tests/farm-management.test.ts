import { describe, it, beforeEach, expect } from "vitest"

describe("Farm Management Contract", () => {
  let mockStorage: Map<string, any>
  let farmNonce: number
  
  beforeEach(() => {
    mockStorage = new Map()
    farmNonce = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "register-farm":
        const [name, location, size] = args
        farmNonce++
        mockStorage.set(`farm-${farmNonce}`, {
          owner: sender,
          name,
          location,
          size,
        })
        return { success: true, value: farmNonce }
      
      case "update-farm":
        const [farmId, updateName, updateLocation, updateSize] = args
        const farm = mockStorage.get(`farm-${farmId}`)
        if (!farm) return { success: false, error: "ERR_NOT_FOUND" }
        if (farm.owner !== sender) return { success: false, error: "ERR_NOT_AUTHORIZED" }
        farm.name = updateName
        farm.location = updateLocation
        farm.size = updateSize
        mockStorage.set(`farm-${farmId}`, farm)
        return { success: true }
      
      case "get-farm":
        return { success: true, value: mockStorage.get(`farm-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a farm", () => {
    const result = mockContractCall("register-farm", ["Green Acres", "123 Farm Road", 1000], "farmer1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should update a farm", () => {
    mockContractCall("register-farm", ["Green Acres", "123 Farm Road", 1000], "farmer1")
    const result = mockContractCall("update-farm", [1, "Green Acres 2", "124 Farm Road", 1200], "farmer1")
    expect(result.success).toBe(true)
  })
  
  it("should not update a farm if not the owner", () => {
    mockContractCall("register-farm", ["Green Acres", "123 Farm Road", 1000], "farmer1")
    const result = mockContractCall("update-farm", [1, "Green Acres 2", "124 Farm Road", 1200], "farmer2")
    expect(result.success).toBe(false)
    expect(result.error).toBe("ERR_NOT_AUTHORIZED")
  })
  
  it("should get a farm", () => {
    mockContractCall("register-farm", ["Green Acres", "123 Farm Road", 1000], "farmer1")
    const result = mockContractCall("get-farm", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      owner: "farmer1",
      name: "Green Acres",
      location: "123 Farm Road",
      size: 1000,
    })
  })
})

