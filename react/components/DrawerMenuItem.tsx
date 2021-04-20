import React, { FunctionComponent } from 'react'
import {Drawer, DrawerCloseButton, DrawerHeader, DrawerTrigger} from 'vtex.store-drawer'
// @ts-expect-error - useTreePath is not a public API
import { useRuntime, useTreePath } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
// @ts-expect-error - Link is not a public API
import {Link} from 'vtex.styleguide'

const CSS_HANDLES = ['categoryName', 'categoryNameContainer', 'categoryExplorerHeader', 'categoryExplorerHeaderContainer', 'exploreAll', 'categoryChildContainer'] as const

const DrawerMenuItem: FunctionComponent<DrawerMenuItemProps> = ({category, children}) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  return (
   <Drawer
      position="left"
      maxWidth="360"
      header={
        <DrawerHeader>
          <DrawerCloseButton></DrawerCloseButton>
        </DrawerHeader>
      }
      customIcon={
        <DrawerTrigger>
          <div className={handles.categoryNameContainer}>
            <div className={handles.categoryName+' '+(category.children.length > 0 ? withModifiers("categoryName", 'active'): '')}>
              {category.name}
            </div>
          </div>
          </DrawerTrigger>
      }
    >
      <div className={handles.categoryExplorerHeaderContainer}>
        <div className={handles.categoryExplorerHeader}>
          {category.name}
        </div>
      </div>
      <Link href={category.href}>
        <span className={handles.exploreAll}>
                Explore all
        </span>
      </Link>
      <div className={handles.categoryChildContainer}>
        {children}
      </div>
    </Drawer>
  )
}


interface Category {
  id: number
  titleTag: string
  href: string
  name: string
  children: Category[]
}

interface DrawerMenuItemProps {
  category: Category
}

export default DrawerMenuItem