<?php

namespace App\Http\Controllers\items;

use Illuminate\Http\Request;
use App\Models\items\Diamond;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class DiamondController extends Controller
{
    public function get_diamond_list(Request $request)
    {
        //input
        $input = json_decode($request->input('diamond_search_information'), true);

        //create query
        $query = Diamond::Query();
        //check if input exist, if yes then configure query
        if (isset($input) && $input != null) {
            if (isset($input['size']) && $input['size'] != null) {
                $query->where('size', $input['size']);
            }
            if (isset($input['diamond_color_id ']) && $input['diamond_color_id '] != null) {
                $query->where('diamond_color_id', $input['diamond_color_id']);
            }
            if (isset($input['diamond_cut_id ']) && $input['diamond_cut_id '] != null) {
                $query->where('diamond_cut_id', $input['diamond_cut_id']);
            }
            if (isset($input['diamond_clarity_id']) && $input['diamond_clarity_id'] != null) {
                $query->where('diamond_clarity_id', $input['diamond_clarity_id']);
            }
            if (isset($input['diamond_origin_id']) && $input['diamond_origin_id'] != null) {
                $query->where('diamond_origin_id', $input['diamond_origin_id']);
            }
        }
        $diamond_list = $query->get();
        $diamond_list->map(function ($diamond) {
            //modify diamond imageUrl
            $OGurl = env('ORIGIN_URL');
            $url = env('DIAMOND_URL');
            $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
            $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
            $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
            $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
            $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
            $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
            unset($diamond->diamond_color_id);
            unset($diamond->diamond_origin_id);
            unset($diamond->diamond_clarity_id);
            unset($diamond->diamond_cut_id);
            return $diamond;
        });
        return response()->json(
            $diamond_list
        );
    }
    public function set_deactivate(Request $request)
    {
        //input
        $input = json_decode($request->input('deactivate'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            $tf = false;
            //find diamond
            $diamond = DB::table('diamond')->where('id', $input['diamond_id'])->first();
            if ($diamond == null) {
                return response()->json([
                    'error' => 'The Selected Diamond Doesn\'t Exist'
                ], 403);
            }
            //check input deactivate
            if ($input['deactivate']) {
                DB::table('diamond')->where('id', $input['diamond_id'])->update([
                    'deactivated' => true,
                ]);
                $tf = true;
            } else {
                DB::table('diamond')->where('id', $input['diamond_id'])->update([
                    'deactivated' => false,
                ]);
                $tf = false;
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        if ($tf) {
            return response()->json([
                'success' => 'Deactivate Diamond Successfully'
            ], 201);
        } else {
            return response()->json([
                'success' => 'Activate Diamond Successfully'
            ], 201);
        }
    }
    public function update_price(Request $request)
    {
        //input
        $input = json_decode($request->input('update_price'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        DB::beginTransaction();
        try {
            //find all product that contain the selected diamond
            $product_diamond  = DB::table('product_diamond')->select('product_id')->where('diamond_id', $input['diamond_id'])->groupby('product_id')->get();
            //update the diamond price
            DB::table('diamond')->where('id', $input['diamond_id'])->update([
                'price' => $input['price'],
                'created' => Carbon::createFromTimestamp(time())->format('Y-m-d H:i:s')
            ]);
            $data = [];
            foreach ($product_diamond as $product) {
                $true = false;
                //find all product_diamond list to update price
                $diamond_list = DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $input['diamond_id'])->get();
                //check if the list has already been update previously to avoid removing the original price
                foreach ($diamond_list as $diamond) {
                    if ($diamond->status == 3) {
                        $true = true;
                    }
                }
                //loop to update diamond price
                foreach ($diamond_list as $diamond) {
                    //update current diamond price
                    if ($diamond->status == 1) {
                        if (!$true) {
                            //set status to save the original current diamond price before update price
                            DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 1)->update([
                                'status' => 3
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 1
                        ];
                        //delete the current diamond price if the original current diamond price has already been saved
                        DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 1)->delete();
                        $data[] = $temp;
                    } else if ($diamond->status == 0) {
                        if (!$true) {
                            //set status to save the original future diamond price before update price
                            DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 0)->update([
                                'status' => 4
                            ]);
                        }
                        $temp = [
                            'product_id' => $product->product_id,
                            'diamond_id' => $diamond->diamond_id,
                            'diamond_shape_id' => $diamond->diamond_shape_id,
                            'count' => $diamond->count,
                            'price' => $input['price'] * $diamond->count,
                            'status' => 0
                        ];
                        //delete the future diamond price if the original diamond price has already been saved
                        DB::table('product_diamond')->where('product_id', $product->product_id)->where('diamond_id', $diamond->diamond_id)->where('status', 0)->delete();
                        $data[] = $temp;
                    }
                }
            }
            //insert all the update diamond price
            DB::table('product_diamond')->insert($data);
            //loop to update diamond price in order and quote
            foreach ($product_diamond as $product) {
                $order =  DB::table('orders')->where('product_id', $product->product_id)->first();
                //check if order exist
                if ($order != null) {
                    $profit_rate = $order->profit_rate;
                    $production_price = $order->production_price;
                    $product_price = 0;
                    $diamond_list = DB::table('product_diamond')->where('product_id', $order->product_id)->get();
                    $metal_list = DB::table('product_metal')->where('product_id', $order->product_id)->get();
                    //calculate new product price after update diamond price
                    foreach ($diamond_list as $diamond) {
                        if ($diamond->status == 1) {
                            $product_price += $diamond->price;
                        }
                    }
                    foreach ($metal_list as $metal) {
                        if ($metal->status == 1) {
                            $product_price += $metal->price;
                        }
                    }
                    DB::table('orders')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => $product_price * ($profit_rate + 100) / 100 + $production_price
                    ]);
                }

                $quote =  DB::table('quote')->where('product_id', $product->product_id)->first();
                //check if quote exist
                if ($quote != null) {
                    $profit_rate = $quote->profit_rate;
                    $production_price = $quote->production_price;
                    $product_price = 0;
                    $diamond_list = DB::table('product_diamond')->where('product_id', $quote->product_id)->get();
                    $metal_list = DB::table('product_metal')->where('product_id', $quote->product_id)->get();
                    //calculate new product price after update diamond price
                    foreach ($diamond_list as $diamond) {
                        if ($diamond->status == 1) {
                            $product_price += $diamond->price;
                        }
                    }
                    foreach ($metal_list as $metal) {
                        if ($metal->status == 1) {
                            $product_price += $metal->price;
                        }
                    }
                    DB::table('quote')->where('product_id', $product->product_id)->update([
                        'product_price' => $product_price,
                        'total_price' => $product_price * ($profit_rate + 100) / 100 + $production_price
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 500);
        }
        return response()->json([
            'success' => 'Price Update Successfully'
        ], 201);
    }
    public function get_diamond_detail(Request $request)
    {
        $input = json_decode($request->input('diamond_id'), true);
        if (!isset($input) || $input == null) {
            return response()->json([
                'error' => 'No Input Received'
            ], 404);
        }
        $diamond = DB::table('diamond')->where('id', $input)->first();
        //modify diamond imageUrl
        $OGurl = env('ORIGIN_URL');
        $url = env('DIAMOND_URL');
        $diamond->imageUrl = $OGurl . $url . $diamond->imageUrl;
        //modify diamond color, origin, clarity, cut
        $diamond->diamond_color = DB::table('diamond_color')->where('id', $diamond->diamond_color_id)->first();
        $diamond->diamond_origin = DB::table('diamond_origin')->where('id', $diamond->diamond_origin_id)->first();
        $diamond->diamond_clarity = DB::table('diamond_clarity')->where('id', $diamond->diamond_clarity_id)->first();
        $diamond->diamond_cut = DB::table('diamond_cut')->where('id', $diamond->diamond_cut_id)->first();
        $diamond->created = Carbon::parse($diamond->created)->format('H:i:s d/m/Y');
        unset($diamond->diamond_color_id);
        unset($diamond->diamond_origin_id);
        unset($diamond->diamond_clarity_id);
        unset($diamond->diamond_cut_id);
        return response()->json([
            $diamond
        ]);
    }
    public function get_shape_list()
    {
        return response()->json(
            DB::table('diamond_shape')->get()
        );
    }
    public function get_diamond_origin_list()
    {
        return response()->json(
            DB::table('diamond_origin')->get()
        );
    }
    public function get_color_list()
    {
        return response()->json(
            DB::table('diamond_color')->get()
        );
    }
    public function get_size_list()
    {
        return response()->json(
            DB::table('diamond')->select('size')->groupBy('size')->get()
        );
    }
    public function get_cut_list()
    {
        return response()->json(
            DB::table('diamond_cut')->get()
        );
    }
    public function get_clarity_list()
    {
        return response()->json(
            DB::table('diamond_clarity')->get()
        );
    }
}
