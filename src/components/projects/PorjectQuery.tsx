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
import { toast } from 'sonner'
import { useFieldArray, useForm } from 'react-hook-form'

const ProjectQuery = () => {
  const [docsUploadError, setDocsUploadError] = useState('')
  const [services, setServices] = useState<{ label: string; value: string }[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [clientName, setClientName] = useState<string>('')
  const [clientEmail, setClientEmail] = useState<string>('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'links', // unique name for your Field Array
  })

  const handleProjectQuery = async ({ name, email, password }) => {
    try {
      if (selectedServices.length === 0) {
        toast.error('Minimum one service need to be selected')
        return
      }

      let data = {
        name: 'untitled',
        services: selectedServices,
        features: selectedFeatures,
        maxPrice: serviceInfo.maxBudget,
        minPrice: serviceInfo.minBudget,
        description: serviceInfo.description,
        docsLinks: links,
      }

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/project-query`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      toast.success('Signup successfull!')
    } catch (err) {
      toast.error(err)
    }
  }
  const handleError = (errors) => {
    console.log(errors)
  }

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
        let serviceData: any = []
        docs.map((el) => serviceData.push({ label: el.title, value: el.id }))
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
              service: {
                in: selectedServices,
              },
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
    if (features && features.length > 0) {
      const newFeatures = JSON.parse(JSON.stringify(features))
      let minBadget = 0
      let maxBadget = 0
      newFeatures.map((feature) => {
        if (selectedFeatures.includes(feature.id)) {
          minBadget += feature.minPrice
          maxBadget += feature.maxPrice
        }
      })
      return `$${minBadget} - $${maxBadget}`
    }
    return `$0`
  }

  return (
    <form
      onSubmit={handleSubmit(handleProjectQuery, handleError)}
      className="max-w-3xl mx-auto my-10 "
    >
      <h1 className="text-2xl font-semibold mb-2 text-center">Get a quote for upcoming project</h1>
      <p className="mb-6 text-gray-600 text-center">
        Choose the service you need, then provide details to help us understand your requirements
        and deliver the best results.
      </p>
      <div className="space-y-4">
        <div>
          <label>Select Services</label>
          <MultiSelector
            values={selectedServices}
            onValuesChange={setSelectedServices}
            options={services}
            loop={false}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select Services" />
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
                  <label
                    htmlFor={feature.id}
                    className="!mb-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <label>Add reference Links (Optional)</label>
          <ul className="list-none border-t border-b py-4">
            {fields.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3">
                <Input type="text" {...register(`test.${index}.link`)} />
                <span onClick={() => remove(index)}>Delete</span>
              </li>
            ))}
          </ul>
          <span className="btn btn-primary" onClick={() => append({ link: '' })}>
            append
          </span>
        </div>
        <hr />

        {selectedFeatures.length > 0 && <p>Your estimated budget is: {getBadget()}</p>}

        <h6>Your Contact Information</h6>
        <div className="flex items-center gap-5">
          <Input
            type="text"
            placeholder="Name"
            required
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value)
            }}
          />

          <Input
            type="email"
            placeholder="Email"
            required
            value={clientEmail}
            onChange={(e) => {
              setClientEmail(e.target.value)
            }}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ProjectQuery
