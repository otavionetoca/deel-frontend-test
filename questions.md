# Questions

1. What is the difference between Component and PureComponent? give an
example where it might break my app.
	#### **Answer**:
	During my carreer I have mostly worked with functional components, so I am unable to answer this questions properly without looking up. I could try and guess that if you cause any side effect within the pure component it might break something, since it might inherit the same standards as a pure function, but still a quite vague answer.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is
that?
	#### **Answer**:
	Same as above goes for this answer. What I do know is that contexts causes the child components to **re-render** whenever its state is updated, therefore it's important to place in the **appropriate level** of the component tree, avoiding child components to **unnecessary re-render** and causing performance issues.
	
3. Describe 3 ways to pass information from a component to its PARENT.
    #### **Answer**:
    1. Creating a function in the parent component, passing it as a prop to the child component, call this function from within the child component and pass the desired information through function parameters.
    2. Using a reducer (or a state management tool) and storing the information within the reducer.
    3. Creating a context and setting the context state from within the child component.

4. Give 2 ways to prevent components from re-rendering.
    #### **Answer**:
    1. Instead of using useState hook, replace it with useRef.
    2. useMemo hook.
    3. useCallback hook.
    4. React.memo .
    5. Creating pure components.

5. What is a fragment and why do we need it? Give an example where it might break my app.
    #### **Answer**:
    Fragments are useful when we want to render a group of components/element avoiding to add new DOM elements, whether it's conditionally or not,  for example:
    ```typescript
    // Non-conditional example
    const AnyComponent = () => {
        return <>
            <label htmlFor="input" />
            <input id="input" />
            {errorMessage && <span>{errorMessage}</span> || null}
        </>
    }

    // Conditional example
    const AnyComponent = ({ firstName, lastName}) => {
        return {
            firstName && lastName && (
            <>
                <td>{firstName}</td>
                <td>{lastName}</td>
            </>
            ) || null
        }
    }
    ```
    and expanding further into why it would break an application, there are elements that if nested improperly, will cause the application to either not work as expected or mess up the output, for example:
    - If we use a `<div>` inside an `<ul>` instead of having and `<li>` wrapping that `div` it won't render the `li` marker, cause the HTML can't find the needed reference to put on the ::marker pseudo-element and produce the correct output.
    - Something weird also happens when using an `<li>` alone (without `<ul>` wrapping it up) is used inside a `<td>`.
    - That's when **Fragments** comes into play, we could use it to wrap a group of `li`s in a standalone component instead of using a `div`, this way, avoiding the application to work as expected:
        ```typescript
        const LiGroupComponent = () => {
            return <>
                <li>Orange</li>
                <li>Watermelon</li>
            </>
        }

        const UlComponent = () => {
            return (
                <ul>
                    <LiGroupComponent />
                </ul>
            )
        }
        ```


6. Give 3 examples of the HOC pattern.
	#### **Answer**:
    - Since I mentioned that I haven't had much contact with class components, I wrote the examples down below using the functional approach.
    1. Let's say that we have to display the signed in user wallet balance, we could do something like:
    ```typescript
    const withWallet = (Component) => {
        // assuming we already fetched the wallet data
        const balance = user.wallet.balance;
        
        return (format) => {
        // necessary logic to format the balance
        //  accordingly to the user location, for example.
            const formattedBalance = format && formatBalance(balance) || null

            <Component balance={formattedBalance || balance} />;
        }
    }

    export default withWallet;
    
    const UserWalletBalance = (props) => {
        return <div>{props.balance}</div>;
    } 
    
    export default withWallet(UserWalletBalance)(false);
    ```
    2. Let's say that we want a piece of our application to only load for certain roles, this way we encapsulate our business logic related to roles in a single HOC instead of having a lot of comparisons throughout our code base inside JSX:
    ```typescript
    const ADMIN_ROLE = "administrator"
    const withAdmin = (Component) => {
        // assuming we already fetched the user info and it's available in a context
        //   for example
        const { role } = useContext(UserContext);

        // if needed we can pass it to the child component as a prop, this is
        //   the case where we don't even want to put the component into the dom
        return role === ADMIN_ROLE && <Component /> || null
    }

    const ButtonsGroups = () => {
        const EditButtonForAdminsOnly = withAdmin(BaseEditButton)

        return (<div>
            <ButtonA />
            <ButtonB />
            <EditButtonForAdminsOnly />
        </div>)
    }

    ```
    3. Loading spinner could be a HOC, also avoiding tons of duplicate code.
    4. Only by using `React.memo() ` we already have a HOC.
    5. Fetch some data using a HOC.
    6. Hook are the younger brother of HOCs.
	
8. What's the difference in handling exceptions in promises, callbacks and
async...await.
    #### **Answer**:
    - In promises, we can rely on the resolve (success) or reject (failure) methods and therefore using .then(), .catch() and .finally() methods to access each of the  e.g.: 
    ```typescript
    const promise = new Promise((resolve, reject) => {
        // condition to resolve
        resolve(Success details)
        // if hasn't met the conditions
        reject(Error details)
    });
    
    promise
        .then(response => {
        // work with the response in here
        }).catch(error => {
            // handle the error
        }).finally(() => {
        // no matter whether it was a success or fail
        })
    ```
    - Async/Await pretty much works the same way as promises, but instead of chaining .then() and .
    catch(), we use instead a try, catch and finally block e.g.:
    ```typescript
    const promise = new Promise((resolve, reject) => {
        // condition to resolve
        resolve(Success details)
        // if hasn't met the conditions
        reject(Error details)
    });
    
    const anonFunc = async () => {
        try {
            await promise()
            // work with the response in here
        } catch(e) {
            // handle the error
        } finally {
            // no matter whether it was a success or fail
        }
    }
    
    anonFunc()
    ```

	- In callbacks, things get a little bit more tricky cause it would return the result to the parent function which would be responsible to determine whether an error or success, since it is a procedural language, nothing would happen before processing the callback e.g.:
    ```typescript
    const callback = (params) => {
        // asynchronous call with params

        return result
    }

    const getData = (params, cb) => {
        const result = cb(params)

        if (result === error) {

            return
        } 

        // success in here

        // finally would live down here
    }

    getData(params, callback)
    ```

9. How many arguments does setState take and why is it async.
    #### **Answer**:
    - This is something I know about class components.
    1. It takes two arguments.
    2. Cause it would imply in performances issue and prevent any other states to update if an expensive setState was called due to the lack of multi-threading.

10. List the steps needed to migrate a Class to Function Component.
    #### **Answer**:
    - This is something I probably know about class components, haven't had to convert too many before.
    1. Turn the `class AnyComponent Extends Component` into a function.
    2. Get rid of the constructor and render method.
    3. Make sure anything that was inside the render method, is compliant with the hooks.
    4. Make sure to translate any of the life cycle methods into hooks.
    5. Translate all states and setState to useState hooks.
    6. If there is anything outside of state although within the constructor, make it a const and place it oustide of the component.
    7. Remove every single `this.`
    8. There you have your brand new functional component.
    
11. List a few ways styles can be used with components.
    - Regular css classes, inline, CSS in JS and styled components (though its a component, still a way to use styles with components).

12. How to render an HTML string coming from the server.
    - Using dangerouslySetInnerHTML? Although it's not safe.