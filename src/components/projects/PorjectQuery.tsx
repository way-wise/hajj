'use client'
import api from '@/utilities/axios'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { stringify } from 'qs-esm'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/multi-select'
import { Feature, Service } from '@/payload-types'

const ProjectQuery = () => {
  const [docsUploadError, setDocsUploadError] = useState('')
  const [links, setLinks] = useState({
    one: '',
    two: '',
    three: '',
  })
  const [services, setServices] = useState<{label:string, value:string}[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const [serviceInfo, setServiceInfo] = useState<any>({
    service: {},
    title: '',
    description: '',
    docs: [],
    minBudget: 0,
    maxBudget: 0,
    features: [],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  })

  useEffect(() => {
    const minBudget = serviceInfo?.features.reduce(
      (accumulator, currentValue) => accumulator + currentValue.minPrice,
      0,
    )
    const maxBudget = serviceInfo?.features.reduce(
      (accumulator, currentValue) => accumulator + currentValue.maxPrice,
      0,
    )
    setServiceInfo((prev: any) => ({
      ...prev,
      minBudget,
      maxBudget,
    }))
  }, [serviceInfo?.features])

  useEffect(() => {
    const getServices = async () => {
      try {
        const stringifiedQuery = stringify(
          {
            limit: 100,
            where: {
              isActive: {
                equals: true,
              },
            },
          },
          { addQueryPrefix: true },
        )
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/services${stringifiedQuery}`,
        )
        const data = await req.json()
        const docs = data.docs || []
        let serviceData:any = []
        docs.map(el => serviceData.push({label:el.title, value:el.id}))
        setServices(serviceData)
      } catch (err) {
        console.log(err)
      }
    }
    getServices()
  }, [])

  useEffect(() => {
    const getFeatures = async (selectedServices) => {
      try {
        const stringifiedQuery = stringify(
          {
            limit: 300,
            where: {
              isActive: {
                equals: true,
              },
              service:{
                in: selectedServices
              }
            },
          },
          { addQueryPrefix: true },
        )
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/features${stringifiedQuery}`,
        )
        const data = await req.json()
        setFeatures(data.docs || [])
      } catch (err) {
        console.log(err)
      }
    }
    getFeatures(selectedServices)
  }, [selectedServices])

  const handleFeatureChange = (checked, id) => {
    const newFeatures = JSON.parse(JSON.stringify(selectedFeatures))
    const currentFeatures = checked ? [...newFeatures, id] : newFeatures.filter((el) => el !== id)
    setSelectedFeatures(currentFeatures)
  }

  const getBadget = () => {
    if(features && features.length > 0){
      const newFeatures = JSON.parse(JSON.stringify(features))
      let minBadget = 0
      let maxBadget = 0
      newFeatures.map((feature) =>{
        if(selectedFeatures.includes(feature.id)){
          minBadget += feature.minPrice
          maxBadget += feature.maxPrice
        }
      })
      return `$${minBadget} - $${maxBadget}`
    }
    return `$0`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let postableData = {
      name: serviceInfo.title,
      services: serviceInfo.service,
      maxPrice: serviceInfo.maxBudget,
      minPrice: serviceInfo.minBudget,
      description: serviceInfo.description,
      docsLinks: [links.one, links.two, links.three],
    }

    if (serviceInfo.features.length > 1) {
      const res = await api.post('/api/project-query', postableData)
      console.log('res', res)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto my-10 ">
      <h1 className="text-2xl font-semibold mb-2 text-center">Get a quote for upcoming project</h1>
      <p className="mb-6 text-gray-600 text-center">
        Choose the service you need, then provide details to help us understand your requirements
        and deliver the best results.
      </p>
      <div className="space-y-4">
        <div>
          <label>Select Service</label>
          <MultiSelector
            values={selectedServices}
            onValuesChange={setSelectedServices}
            options={services}
            loop={false}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select your framework" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {services &&
                  services.length > 0 &&
                  services.map((option, i) => (
                    <MultiSelectorItem key={i} value={option.value}>
                      {option.label}
                    </MultiSelectorItem>
                  ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </div>
        {features && (
          <>
            <h6>
              Project features (Optional){' '}
              {!(features.length > 1) && (
                <span className="text-xs text-red-500 animate-bounce ">
                  Please choose at least two
                </span>
              )}
            </h6>

            <div className="space-y-3 ml-2 max-h-[150px] overflow-y-auto">
              {features?.map((feature) => (
                <div key={feature?.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => handleFeatureChange(checked, feature.id)}
                    id={feature.id}
                  />
                  <label htmlFor={feature.id} className="!mb-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Project Description */}
        <div>
          <label>Brief project summary </label>

          <Textarea
            placeholder="Provide a detailed description of your project requirements"
            value={serviceInfo.description}
            onChange={(e) => setServiceInfo((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {/* Document Upload */}
        <div>
          <label>
            Upload Documents (Optional){' '}
            {docsUploadError && <span className="text-red-500 text-xs">{docsUploadError}</span>}
          </label>
          <Input
            type="file"
            onChange={(e: any) => {
              const maxSize = 5 * 1024 * 1024
              const files = e.target.files
              let errorMessage = ''

              for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                  setDocsUploadError(`File ${files[i].name} exceeds the maximum size of 5MB.`)
                  break // Break on the first error
                } else {
                  setServiceInfo((prev: any) => ({ ...prev, docs: [...prev.docs, files[i]] }))
                  setDocsUploadError('')
                }
              }

              if (errorMessage) {
                console.error(errorMessage) // Handle error as needed
              }
            }}
            accept=".pdf,.doc,.jpg,.png"
            multiple
            max={5}
          />
        </div>

        <div>
          <label>Add Documents Links (Optional)</label>
          <div className="flex items-center gap-5 *:flex-1">
            <Input
              type="text"
              value={links.one}
              placeholder="link1"
              onChange={(e: any) => {
                setLinks((prev) => ({
                  ...prev,
                  one: e.target.value,
                }))
              }}
            />
            <Input
              type="text"
              value={links.two}
              placeholder="link2"
              onChange={(e: any) => {
                setLinks((prev) => ({
                  ...prev,
                  two: e.target.value,
                }))
              }}
            />
            <Input
              type="text"
              value={links.three}
              placeholder="link3"
              onChange={(e: any) => {
                setLinks((prev) => ({
                  ...prev,
                  three: e.target.value,
                }))
              }}
            />
          </div>
        </div>
        <hr />

        {selectedFeatures.length > 0 && (
          <p>
            Your estimated budget is: {getBadget()}
          </p>
        )}

        <h6>Your Contact Information</h6>
        <div className="flex items-center gap-5">
          <Input
            type="text"
            placeholder="Name"
            required
            value={serviceInfo.customerName}
            onChange={(e) => {
              setServiceInfo((prev) => ({ ...prev, customerName: e.target.value }))
            }}
          />

          <Input
            type="email"
            placeholder="Email"
            required
            value={serviceInfo.customerEmail}
            onChange={(e) => {
              setServiceInfo((prev) => ({ ...prev, customerEmail: e.target.value }))
            }}
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  )
}

export default ProjectQuery
