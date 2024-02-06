import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {createRef} from '@motion-canvas/core/lib/utils';
import {
  CodeBlock,
  edit,
  insert,
  lines,
  remove,
} from '@motion-canvas/2d/lib/components/CodeBlock';
import {Line} from '@motion-canvas/2d/lib/components/Line';
import {all, waitFor} from '@motion-canvas/core/lib/flow';
import {createSignal, SignalValue} from '@motion-canvas/core/lib/signals';

export default makeScene2D(function* (view) {
  const code = createRef<CodeBlock>();
  view.add(
    <CodeBlock
      ref={code}
      scale={0.3}
      code={`
class DispatchCommand<StateType : CommandContext>(
    override val id: String,
    private val action: DispatchAction<StateType>,
    private val predicates: List<DispatchPredicate<StateType>> = emptyList(),
    private val arguments: List<DispatchArgument<StateType, *>> = emptyList(),
    private val optionalArguments: List<DispatchOptionalArgument<StateType, *>> = emptyList(),
    private val children: Map<String, DispatchCommand<StateType>> = emptyMap(),
) : Identified {
    companion object {
        fun <T : CommandContext> build(key: String, fn: DispatchCommandBuilder<T>.() -> Unit): DispatchCommand<T> {
            val builder = DispatchCommandBuilder<T>(key)
            fn(builder)
            return builder.build()
        }
    }

    private val argsByPosition: List<Pair<DispatchArgument<StateType, *>, Int>>
    private val requiredArgumentLength = arguments.fold(0) { sum, it -> sum + it.expectedArgs }

    init {
        val argsByPosition = mutableListOf<Pair<DispatchArgument<StateType, *>, Int>>()
        var counter = 0
        for (arg in arguments) {
            for (position in 0 until arg.expectedArgs) {
                argsByPosition.add(arg to counter)
            }
            counter += arg.expectedArgs
        }
        this.argsByPosition = argsByPosition
    } 

    private fun isInvalidArgLength(args: List<String>): Boolean {
        if (args.size < requiredArgumentLength) {
            return true
        }
        return false
    }
}`}
    ></CodeBlock>,
  );
  yield* waitFor(10);
  yield* code().opacity(0, 1);

  const codeRef = createRef<CodeBlock>();

  yield view.add(<CodeBlock ref={codeRef} code={`var myBool;`} />);

  yield* codeRef().edit(1.2, false)`var myBool${insert(' = true')};`;
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2)`var myBool = ${edit('true', 'false')};`;
  yield* waitFor(0.6);
  yield* all(
    codeRef().selection(lines(0, Infinity), 1.2),
    codeRef().edit(1.2, false)`var my${edit('Bool', 'Number')} = ${edit(
      'false',
      '42',
    )};`,
  );
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2, false)`var myNumber${remove(' = 42')};`;
  yield* waitFor(0.6);
  yield* codeRef().edit(1.2, false)`var my${edit('Number', 'Bool')};`;
  yield* waitFor(0.6);

  const lineCapSignal: SignalValue<CanvasLineCap> =
    createSignal<CanvasLineCap>('round');
  const ftLinesStyle = {
    end: 0,
    opacity: 0,
    endArrow: true,
    arrowSize: 25,
    lineCap: lineCapSignal,
    y: 60,
    lineWidth: 15,
    stroke: '#ffffff',
  };

  <Line
    {...ftLinesStyle}
    points={[
      [0, 0],
      [-40, 60],
    ]}
    x={-40}
  />;
});
