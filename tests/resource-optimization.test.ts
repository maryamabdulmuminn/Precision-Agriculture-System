import { describe, it, beforeEach, expect } from "vitest"

describe("Resource Optimization Contract", () => {
  let mockStorage: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "allocate-resource":
        const [allocateFarmId, allocateResource, allocateAmount] = args
        const currentUsage = mockStorage.get(`usage-${allocateFarmId}-${allocateResource}`) || {
          allocated: 0,
          used: 0,
          last_updated: 0,
        }
        mockStorage.set(`usage-${allocateFarmId}-${allocateResource}`, {
          allocated: currentUsage.allocated + allocateAmount,
          used: currentUsage.used,
          last_updated: Date.now(),
        })
        return { success: true }
      
      case "record-resource-usage":
        const [recordFarmId, recordResource, recordAmount] = args
        const usage = mockStorage.get(`usage-${recordFarmId}-${recordResource}`)
        if (!usage) return { success: false, error: "ERR_NOT_FOUND" }
        usage.used += recordAmount
        usage.last_updated = Date.now()
        mockStorage.set(`usage-${recordFarmId}-${recordResource}`, usage)
        return { success: true }
      
      case "get-resource-usage":
        const [getUsageFarmId, getUsageResource] = args
        return { success: true, value: mockStorage.get(`usage-${getUsageFarmId}-${getUsageResource}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should allocate resource", () => {
    const result = mockContractCall("allocate-resource", [1, "water", 1000], "anyone")
    expect(result.success).toBe(true)
  })
  
  it("should record resource usage", () => {
    mockContractCall("allocate-resource", [1, "water", 1000], "anyone")
    const result = mockContractCall("record-resource-usage", [1, "water", 500], "anyone")
    expect(result.success).toBe(true)
  })
  
  it("should not record resource usage if not allocated", () => {
    const result = mockContractCall("record-resource-usage", [1, "water", 500], "anyone")
    expect(result.success).toBe(false)
    expect(result.error).toBe("ERR_NOT_FOUND")
  })
  
  it("should get resource usage", () => {
    mockContractCall("allocate-resource", [1, "water", 1000], "anyone")
    mockContractCall("record-resource-usage", [1, "water", 500], "anyone")
    const result = mockContractCall("get-resource-usage", [1, "water"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      allocated: 1000,
      used: 500,
      last_updated: expect.any(Number),
    })
  })
})

