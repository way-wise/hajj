'use client'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'

const Form2 = ({ serviceInfo, setServiceInfo, features, handleNext, handleBack }) => {
  const handleCheckboxChange = (feature) => {
    setServiceInfo((prev) => {
      const isSelected = prev.features.some((f) => f.id === feature.id)

      return {
        ...prev,
        features: isSelected
          ? prev.features.filter((f) => f.id !== feature.id) // Remove if already selected
          : [...prev.features, feature], // Add if not selected
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h5>Project features (Optional)</h5>
      <div className="space-y-3 ml-2">
        {features?.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            <Checkbox
              checked={serviceInfo.features.some((f) => f.id === feature.id)}
              onCheckedChange={() => handleCheckboxChange(feature)}
              id={feature.id}
            />
            <label htmlFor={feature.id} className="!mb-0">
              {feature.name}
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  )
}

export default Form2
