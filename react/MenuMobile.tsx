import React, { FunctionComponent, useReducer, useState } from 'react'
import { Query } from 'react-apollo'
import categoryWithChildren from './graphql/categoryWithChildren.graphql'
// import DrawerMenuItem from './components/DrawerMenuItem'
import StyledLink from './components/StyledLink'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import CATEGORIES from './definedCategories'
import hiddenCategories from './hiddenCategoriesId'

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
    id: number | string
    titleTag: string
    href: string | undefined
    name: string
    hasChildren: boolean
    children: Category[]
    hidden ?: boolean
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
    'dropDownContainer',
    'categoryMenuWrapper',
    'linksSection',
    'link',
    'linkIcon',
    'linkContainer',
    'topCategories',
    'exploreAllMobile',
    'exploreAllLink',
    'exploreAllTitle',
    'subCategoryLink',
    'backBtn',
    'allCategoriesText',
    'categoriesTitle',
    'allCategoriesTitle',
    'topCategory',
    'topCategoryWrapper',
    'linkIconHome',
    'linkIconProfileMobile',
    'linkIconOrdersMobile',
    'linkIconWishlistMobile'

] as const
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
function hideCategories(categories: Category[], ID: Array<String>){
    for(let item of categories){
        let obj = ID.find(el => el == item.id.toString())
        if(obj){
            item.hidden = true
        }
        if(item.hasChildren){
            hideCategories(item.children, ID)
        }
    }
    return categories
}



const MenuDropDawn: FunctionComponent<CategoryMenuProps> = ({}: CategoryMenuProps) => {
    const handles = useCssHandles(CSS_HANDLES)
    const [isOpen, setOpen] = useState(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    const goToSubCategoryList = (category : Category ) =>{
        
        dispatch({type: 'ADD_SNAP', args: {snap: category.children, category: category}})
    }
    const backBtnHandler = () => {
        if(state.history.length === 1){
            setOpen(false)
            // document.body.style.overflow = 'auto'
        }else{
            dispatch({type: 'REMOVE_SNAP'})
        }
    }

    return (
        <Query query={categoryWithChildren}>
            {({data, loading, error }: any) => {
                if (error || loading) {
                // TODO add loader and error message
                return null
            }
            const {categories}: {categories: any[]} = data
            const changedUrlCategories = changeURL(categories, CATEGORIES )
            const hiddenPropCategories = hideCategories(changedUrlCategories, hiddenCategories);
            if(state.history.length === 0){
                dispatch({type: 'INIT_HISTORY', args:{initialHistory: hiddenPropCategories}})
            }
            if(!isOpen){
                return(
                    <div>
                        <div className={`${handles.handles.linksSection}`}>
                            <div className={`${handles.handles.linkContainer}`} >
                                <div className={`${handles.handles.linkIconHome}`}>
                                </div>
                                <Link className={`${handles.handles.link}`} to={'https://www.alleop.bg/'}> Начало </Link>
                            </div>
                            <div className={`${handles.handles.linkContainer}`} >
                                <div className={`${handles.handles.linkIconProfileMobile}`}>
                                </div>
                                <Link className={`${handles.handles.link}`} to={'https://www.alleop.bg/account#/profile'}  > Моят профил </Link>
                            </div>
                            <div className={`${handles.handles.linkContainer}`} >
                                <div className={`${handles.handles.linkIconOrdersMobile}`}>
                                </div>
                                <Link className={`${handles.handles.link}`} to={'https://www.alleop.bg/account#/orders'}  > Моите поръчки </Link>
                            </div>
                            <div className={`${handles.handles.linkContainer}`} >
                                <div className={`${handles.handles.linkIconWishlistMobile}`}>
                                </div>
                                <Link to={'https://www.alleop.bg/account#/wishlist'} className={`${handles.handles.link}`}  > Моите списъци </Link>
                            </div>
                        </div>
                        <div className={`${handles.handles.topCategoryWrapper}`}>
                            <div className={`${handles.handles.topCategory}`}>Топ категории</div>
                            <div className={`${handles.handles.topCategories}`}>
                                <CategoryLink id={13} href="/uredi-za-kuhnyata-c13" name="Уреди за кухнята" children={[]} hasChildren={false} titleTag="Уреди за кухнята"/>
                                <CategoryLink id={12} href="/uredi-za-doma-c12" name="Уреди за дома" children={[]} hasChildren={false} titleTag="Уреди за дома"/>
                            </div>
                            <div onClick={()=> {setOpen(true); document.body.style.overflow = 'hidden'}} className={`${handles.handles.allCategoriesTitle}`}>
                                Виж всички категории
                            </div>
                        </div>
                    </div>
                    
                )
            }
            return(
                <div className={`${handles.handles.categoryMenuWrapper}`}>
                    <div onClick={() => backBtnHandler()} className={`${handles.handles.backBtn}`}>
                        Обратно
                    </div>
                    {state.history.length === 1 ? 
                        <div className={`${handles.handles.allCategoriesText}`}>
                            Всички категории
                        </div>
                        :
                        null
                    }
                    
                    <div className={`${handles.handles.dropDownContainer}`}>
                        {state.parentCategoryHistory.length >= 1 ? 
                            <>
                                <div className={`${handles.handles.exploreAllMobile}`}>
                                    <div className={`${handles.handles.exploreAllTitle}`}>
                                        {state.parentCategoryHistory[state.parentCategoryHistory.length - 1].name}
                                    </div>
                                    <Link 
                                        to={`${state.parentCategoryHistory[state.parentCategoryHistory.length - 1].href}`}
                                        className={`${handles.handles.exploreAllLink}`}
                                    >
                                        Виж всички
                                    </Link>
                                </div>
                                <div className={`${handles.handles.categoriesTitle}`}>
                                    Категории
                                </div>
                            </>
                            :
                            null
                        
                        } 

                        {state.history[state.history.length - 1].map((category : Category )=> {
                            if( category.hidden){
                                return null
                            }
                            else if(category.hasChildren){
                                return(
                                    <div onClick={()=> goToSubCategoryList(category)} className={`${handles.handles.subCategoryLink}`}>
                                        {category.name}
                                    </div>
                                )
                            }else{
                                return(
                                    <CategoryLink key={category.id} {...category}/>
                                )
                            }
                        }  
                        )}
                    </div>
                </div>
            )
            }}
        </Query>
        )
    }
export default MenuDropDawn