'use client'

import { useMediaDevices } from '@/lib/states/media_devices'
import { Select, SelectItem, SelectProps } from '@nextui-org/react'
import React from 'react'

export default function MediaDevicesSelect(props: Partial<SelectProps & OnSelectHandler<MediaDeviceInfo>>) {
    const devices = useMediaDevices({ video: true })
    return (
        <Select {...props} onSelectionChange={s => {
            const selectedKeys = Array.from(s)
            const selectedGroups = devices?.filter(d => selectedKeys.includes(d.deviceId))
            props.onSelection?.call(undefined, selectedGroups?.at(0))
            props.onSelections?.call(undefined, selectedGroups)
        }} items={devices?.filter(d => !!d.deviceId) ?? ([] as MediaDeviceInfo[])} isLoading={devices === undefined} >
            {(d) => (
                <SelectItem key={d.deviceId}>{d.label}</SelectItem>
            )}
        </Select>
    )
}
