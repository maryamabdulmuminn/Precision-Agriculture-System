import { describe, it, beforeEach, expect } from "vitest"

describe("Sensor Data Contract", () => {
  let mockStorage: Map<string, any>
  let dataNonce: number
  
  beforeEach(() => {
    mockStorage = new Map()
    dataNonce = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "record-sensor-data":
        const [farmId, sensorType, value] = args
        dataNonce++
        mockStorage.set(`data-${dataNonce}`, {
          farm_id: farmId,
          sensor_type: sensorType,
          value,
          timestamp: Date.now(),
        })
        return { success: true, value: dataNonce }
      
      case "get-sensor-data":
        return { success: true, value: mockStorage.get(`data-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should record sensor data", () => {
    const result = mockContractCall("record-sensor-data", [1, "temperature", 25], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get sensor data", () => {
    mockContractCall("record-sensor-data", [1, "temperature", 25], "anyone")
    const result = mockContractCall("get-sensor-data", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      farm_id: 1,
      sensor_type: "temperature",
      value: 25,
      timestamp: expect.any(Number),
    })
  })
})

