import React, { FunctionComponent, useReducer, useState } from 'react'
import { Query } from 'react-apollo'
import categoryWithChildren from '../graphql/categoryWithChildren.graphql'
// import DrawerMenuItem from './components/DrawerMenuItem'
import StyledLink from '../components/StyledLink'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import CATEGORIES from '../definedCategories'

function changeURL(categories : Category[], URL: ({
    id: string;
    url: string;
} | {
    id: string;
    url?: undefined;
})[] ){
    for(let item of categories){
        let obj = URL.find(el => el.id == item.id.toString())
        if(obj){
            item.href = obj.url
        }

        if(item.children){
            changeURL(item.children, URL)
        }
    }
    return categories
}

interface State{
    history: Array<Category[]>
    parentCategoryHistory: Category[]
}
const initialState : State = {
    history: new Array<Category[]>(),
    parentCategoryHistory: new Array<Category>()
}
type ReducerActions = 
    | {type: 'INIT_HISTORY'; args: { initialHistory: Category[]} }
    | {type: 'ADD_SNAP'; args: {snap: Category[], category: Category}}
    | {type: 'REMOVE_SNAP'}

const reducer = (state : State, action: ReducerActions) => {
    switch (action.type){
        case 'INIT_HISTORY':
            let initial = state.history
            initial.push(action.args.initialHistory)
            return{
                ...state,
                history: initial
            }
        case 'ADD_SNAP':
            let nextHistory = state.history 
            nextHistory.push(action.args.snap)
            let nextParent = state.parentCategoryHistory
            nextParent.push(action.args.category)
            return{
                parentCategoryHistory: nextParent,
                history: nextHistory
            }
        case 'REMOVE_SNAP':
            let dec = state.history.slice(0, state.history.length - 1)
            let prevParent = state.parentCategoryHistory.slice(0, state.parentCategoryHistory.length - 1)
            return{
                history: dec,
                parentCategoryHistory: prevParent
            }
        default:
            return state
    }
}


interface Category {
    id: number
    titleTag: string
    href: string | undefined
    name: string
    hasChildren: boolean
    children: Category[]
    iconPath ?: string
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
const CSS_HANDLES = [
    'dropDownContainerDesktop',
    'categoryMenuWrapperDesktop',
    'linksSectionDesktop',
    'linkDesktop',
    'linkIconDesktop',
    'linkContainerDesktop',
    'topCategoriesDesktop',
    'exploreAllMobileDesktop',
    'exploreAllLinkDesktop',
    'exploreAllTitleDesktop',
    'subCategoryLinkDesktop',
    'backBtnDesktop',
    'allCategoriesTextDesktop',
    'categoriesTitleDesktop',
    'allCategoriesTitleDesktop',
    'topCategoryDesktop',
    'topCategoryWrapperDesktop',
    'categoryItemWrapperDesktop',
    'icon673',
    'icon678',
    'icon12',
    'icon13',
    'icon16',
    'icon17',
    'icon20',
    'iconDefault',
    'linksSection',
    'linkContainer',
    'categoriesLinkProfile',
    'categoriesLinkOrders',
    'categoriesLinkWishlist',
    'categoriesLinkHelp',

] as const



const CategoryMenu: FunctionComponent<CategoryMenuProps> = ({}: CategoryMenuProps) => {
    const handles = useCssHandles(CSS_HANDLES)
    const [isOpen, setOpen] = useState(true)
    const [state, dispatch] = useReducer(reducer, initialState)
    const goToSubCategoryList = (category : Category ) =>{
        dispatch({type: 'ADD_SNAP', args: {snap: category.children, category: category}})
    }
    const backBtnHandler = () => {
        if(state.history.length === 1){
            setOpen(false)
            document.body.style.overflow = 'auto'
        }else{
            dispatch({type: 'REMOVE_SNAP'})
        }
    }

    return (
        <Query query={categoryWithChildren}>
            {({ data, loading, error }: any) => {
                if (error || loading) {
                // TODO add loader and error message
                return null
            }
            const {categories}: {categories: any[]} = data
            const changedUrlCategories = changeURL(categories, CATEGORIES )
            if(state.history.length === 0){
                dispatch({type: 'INIT_HISTORY', args:{initialHistory: changedUrlCategories}})
            }
            if(!isOpen){
                return(
                    <div>
                        <div className={`${handles.handles.topCategoryWrapperDesktop}`}>
                            <div className={`${handles.handles.topCategoryDesktop}`}>Top categories</div>
                            <div onClick={()=> {setOpen(true); document.body.style.overflow = 'hidden'}} className={`${handles.handles.allCategoriesTitleDesktop}`}>
                                See All Categories
                            </div>
                        </div>
                    </div>
                    
                )
            }
            return(
                <div className={`${handles.handles.categoryMenuWrapperDesktop}`}>
                    {
                        state.history.length !== 1 ?
                        <div onClick={() => backBtnHandler()} className={`${handles.handles.backBtnDesktop}`}>
                            Обратно
                        </div>
                        :
                        null
                    }


                    {state.history.length === 0 ? 
                        <div className={`${handles.handles.allCategoriesTextDesktop}`}>
                            All categories
                        </div>
                        :
                        null
                    }
                    
                    <div className={`${handles.handles.dropDownContainerDesktop}`}>
                        {state.parentCategoryHistory.length >= 1 ? 
                            <>
                                <div className={`${handles.handles.exploreAllMobileDesktop}`}>
                                    <div className={`${handles.handles.exploreAllTitleDesktop}`}>
                                        {state.parentCategoryHistory[state.parentCategoryHistory.length - 1].name}
                                    </div>
                                    <Link 
                                        to={`${state.parentCategoryHistory[state.parentCategoryHistory.length - 1].href}`}
                                        className={`${handles.handles.exploreAllLinkDesktop}`}
                                    >
                                        Виж всички
                                    </Link>
                                </div>
                                <div className={`${handles.handles.categoriesTitleDesktop}`}>
                                    Categories
                                </div>
                            </>
                            :
                            null
                        
                        } 

                        {state.history[state.history.length - 1].map((category : Category )=> {
                            if(category.hasChildren){
                                return(
                                    <div key={category.id} className={`${handles.handles.categoryItemWrapperDesktop}`}>
                                        <div className={`${category.id == 673 ? handles.handles.icon673 
                                            : category.id == 678 ? handles.handles.icon678
                                            : category.id == 12 ? handles.handles.icon12 
                                            : category.id == 13 ? handles.handles.icon13
                                            : category.id == 16 ? handles.handles.icon16
                                            : category.id == 17 ? handles.handles.icon17
                                            : category.id == 20 ? handles.handles.icon20
                                            : state.history.length !== 1 ? ''
                                            : handles.handles.iconDefault
                                            }`}></div>
                                        <div onClick={()=> goToSubCategoryList(category)} className={`${handles.handles.subCategoryLinkDesktop}`}>
                                            {category.name}
                                        </div>
                                    </div>
                                )
                            }else{
                                return(
                                    <div className={`${handles.handles.categoryItemWrapperDesktop}`}>
                                        <CategoryLink key={category.id} {...category}/>
                                    </div>
                                )
                            }
                        }  
                        )}
                        {state.history.length == 1 ?
                            <div className={`${handles.handles.linksSectionDesktop}`}>
                                <div className={`${handles.handles.linkContainer}`} >
                                    <Link className={`${handles.handles.categoriesLinkProfile}`} to={'https://www.alleop.bg/account#/profile'}  > Моят профил </Link>
                                </div>
                                <div className={`${handles.handles.linkContainer}`} >
                                    <Link className={`${handles.handles.categoriesLinkOrders}`} to={'https://www.alleop.bg/account#/orders'}  > Моите поръчки </Link>
                                </div>
                                <div className={`${handles.handles.linkContainer}`} >
                                    <Link to={'https://www.alleop.bg/account#/wishlist'} className={`${handles.handles.categoriesLinkWishlist}`}  > Моите списъци </Link>
                                </div>
                                <div className={`${handles.handles.linkContainer}`}>
                                    <Link to={'https://help.alleop.bg/'} className={`${handles.handles.categoriesLinkHelp}`}>Помощен център</Link>
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                </div>
            )
            }}
        </Query>
        )
    }
export default CategoryMenu