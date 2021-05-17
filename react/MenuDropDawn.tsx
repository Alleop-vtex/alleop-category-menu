import React, { FunctionComponent } from 'react'
import { Query } from 'react-apollo'
import categoryWithChildren from './graphql/categoryWithChildren.graphql'
import DrawerMenuItem from './components/DrawerMenuItem'
import StyledLink from './components/StyledLink'

interface Category {
    id: number
    titleTag: string
    href: string
    name: string
    hasChildren: boolean
    children: Category[]
}
interface CategoryMenuProps {
    customText?: string
}
interface CategoryLinkProps extends Category {
    isTitle?: boolean
  }
const CategoryLink: FunctionComponent<CategoryLinkProps> = ({
    href,
    titleTag,
    isTitle,
    name,
  }: CategoryLinkProps) => {
    return (
      <StyledLink title={titleTag} to={href} isTitle={isTitle}>
        {name}
      </StyledLink>
    )
  }



const MenuDropDawn: FunctionComponent<CategoryMenuProps> = ({}: CategoryMenuProps) => {
    return (
        <Query query={categoryWithChildren}>
            {({ data, loading, error }: any) => {
                if (error || loading) {
                // TODO add loader and error message
                return null
            }
            const {categories}: {categories: any[]} = data

            return (
                <>
                {categories.map((category: Category) => (
                    <>
                    {category.hasChildren ?
                    <DrawerMenuItem key={category.id} category={category} backdropMode='visible' >
                        {category.children?.map((child: Category) => (
                        <>
                            {child.hasChildren ? 
                            <DrawerMenuItem key={child.id} category={child} backdropMode='invisible'>
                                {child.children?.map((child2: Category) => (
                                <CategoryLink key={child2.id} {...child2}/>
                                ))}
                            </DrawerMenuItem>
                            : 
                            <CategoryLink key={child.id} {...child}/>
                            }
                        </>
                        ))}
                        </DrawerMenuItem>
                        :
                        <CategoryLink key={category.id} {...category}/>
                        }
                    </>
                ))}
                </>
            )
            }}
        </Query>
        )
    }
export default MenuDropDawn